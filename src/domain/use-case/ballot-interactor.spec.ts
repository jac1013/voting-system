import {
  OptionNotPresentInElectionError,
  BallotInteractor,
  BallotInteractorImpl,
  VoterNotAllowedError,
  VoteWithoutActiveElectionError,
} from './ballot-interactor';
import { Election } from '../entities/election';
import * as moment from 'moment';
import { User } from '../entities/user';
import { ElectionOption } from '../entities/election-option';
import { Voter } from '../entities/voter';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionLedger } from '../database/election-ledger';
import { BallotRepository } from '../database/ballot-repository';
import { ElectionOptionRepository } from '../database/election-option-repository';
import { VoterInteractor, VoterInteractorImpl } from './voter-interactor';
import { VoterRepository } from '../database/voter-repository';
import { UserInteractor } from './user-interactor';
import { PermanentMetadata } from '../entities/permanent-metadata';
import { PermanentTransaction } from '../entities/permanent-transaction';
import { encrypt } from '../utils/crypto';

process.env.BLOCKCHAIN_CONFIRMATION_INTERVAL_TIME_IN_MS = '1000';

describe('VoteInteractor', () => {
  let election: Election;
  let voteInteractor: BallotInteractor;
  let electionLedger: ElectionLedger;
  let user: User;
  let voter: Voter;
  let option: ElectionOption;
  let option2: ElectionOption;
  let emailMock: EmailProvider;
  let blockchainMock: BlockchainProvider;
  let ballotRepository: BallotRepository;
  let electionOptionRepo: ElectionOptionRepository;
  let voterInteractor: VoterInteractor;
  let permanentTransaction: PermanentTransaction;

  beforeEach(() => {

    election = new Election(
      moment.utc().format(),
      moment.utc().add(1, 'days').format(),
    );
    option = new ElectionOption(1, 'president 1');
    option2 = new ElectionOption(2, 'president 2');
    election.addOption(option);
    election.addOption(option2);
    electionLedger = new ElectionLedgerMock();
    emailMock = new EmailProviderMock();
    blockchainMock = new BlockchainProviderMock();
    ballotRepository = new BallotRepositoryMock();
    electionOptionRepo = new ElectionOptionRepositoryMock();
    voterInteractor = new VoterInteractorImpl(
      new VoterRepoMock(),
      new UserInteractorMock(),
    );
    voteInteractor = new BallotInteractorImpl(
      election,
      new ElectionLedgerMockFalseRecorded(),
      emailMock,
      blockchainMock,
      ballotRepository,
      electionOptionRepo,
      voterInteractor,
    );
    user = new User('some@email.com');
    voter = new Voter('', '', '');
    voter.id = 4;
    permanentTransaction = new PermanentTransaction();
    permanentTransaction.id = 'hello';
    permanentTransaction.metadata = {
      iv: '16faa7ee476de168bf623c7c906c7e69',
      choiceId: 1,
      content: '0986f5ecec25b930ae5559',
    };
    permanentTransaction.status = 'in_ledger';
    election.start();
  });

  describe('vote()', () => {
    it('should return an error if the election is not active', () => {
      election.end();
      voteInteractor.vote(user, 1).catch((error) => {
        expect(error).toBeInstanceOf(VoteWithoutActiveElectionError);
      });
    });
    it('should return an error if the user has no voter profile in it', async () => {
      voterInteractor = new VoterInteractorImpl(
        new VoterRepoMockWithoutVoter(),
        new UserInteractorMock(),
      );
      voteInteractor = new BallotInteractorImpl(
        election,
        new ElectionLedgerMockFalseRecorded(),
        emailMock,
        blockchainMock,
        ballotRepository,
        electionOptionRepo,
        voterInteractor,
      );
      const userWithoutVoter = new User('some@email.com');
      voteInteractor.vote(userWithoutVoter, 1).catch((error) => {
        expect(error).toBeInstanceOf(VoterNotAllowedError);
      });
    });
    it('should return an error if the choiceId of the option is not present in the election', () => {
      voteInteractor.vote(user, 3).catch((error) => {
        expect(error).toBeInstanceOf(OptionNotPresentInElectionError);
      });
    });
    it('should set the voter in this election ledger', async () => {
      await voteInteractor.vote(user, 1);
      const isRecorded = await electionLedger.isRecorded(1, 1);
      expect(isRecorded).toEqual(true);
    });
    it('should try to save the transaction in the blockchain network', async () => {
      const spy = jest.spyOn(blockchainMock, 'createTransaction');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    // TODO: I don't want to deal with interval test right now
    // it('should send an email when the transaction in the blockchain network is complete', async () => {
    //   jest.useFakeTimers();
    //   const spy = jest.spyOn(emailMock, 'sendSuccessfulVoteEmail');
    //   await voteInteractor.vote(user, 1);
    //   jest.advanceTimersByTime(1000);
    //   expect(setInterval).toHaveBeenCalled();
    //   expect(spy).toHaveBeenCalledTimes(1);
    //   jest.clearAllTimers();
    // });
    it('should send an email when the transaction in the blockchain fails', async () => {
      voteInteractor = new BallotInteractorImpl(
        election,
        new ElectionLedgerMockFalseRecorded(),
        emailMock,
        new BlockchainFailMock(),
        ballotRepository,
        electionOptionRepo,
        voterInteractor,
      );
      const spy = jest.spyOn(emailMock, 'sendFailProcessingVoteEmail');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalled();
    });
    it('should set the voter as it didnt vote if the blockchain process fails', async () => {
      electionLedger = new ElectionLedgerMockFalseRecorded();
      voteInteractor = new BallotInteractorImpl(
        election,
        electionLedger,
        emailMock,
        new BlockchainFailMock(),
        ballotRepository,
        electionOptionRepo,
        voterInteractor,
      );
      await voteInteractor.vote(user, 1);
      const isRecorded = await electionLedger.isRecorded(1, 1);
      expect(isRecorded).toEqual(false);
    });
    it('should save the ballot in a repository', async () => {
      const spy = jest.spyOn(ballotRepository, 'save');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should update the ballot with the permanentId when the blockchain transaction ends successfully', async () => {
      const spy = jest.spyOn(ballotRepository, 'update');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should remove the ballot if the process fails', async () => {
      electionLedger = new ElectionLedgerMockFalseRecorded();
      voteInteractor = new BallotInteractorImpl(
        election,
        electionLedger,
        emailMock,
        new BlockchainFailMock(),
        ballotRepository,
        electionOptionRepo,
        voterInteractor,
      );
      const spy = jest.spyOn(ballotRepository, 'remove');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalled();
    });
    it('should find the electionOption from the choiceId', async () => {
      const spy = jest.spyOn(electionOptionRepo, 'getByChoiceId');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isValid()', () => {
    it('should get the ballot for this permanentId', async () => {
      const spy = jest.spyOn(ballotRepository, 'findByPermanentId');
      await voteInteractor.isValid(permanentTransaction);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return true if the confirmationHash match the metadata from permanent transaction`, async () => {
      const result = await voteInteractor.isValid(permanentTransaction);
      expect(result).toEqual(true);
    });
    it(`should return false if the confirmationHash doesn't match the metadata from permanent transaction`, async () => {
      permanentTransaction = new PermanentTransaction();
      permanentTransaction.id = 'hello';
      permanentTransaction.metadata = {
        // wrong iv
        iv: '16faa7ee476de168bf623c7c906c7e68',
        choiceId: 1,
        content: '0986f5ecec25b930ae5559',
      };
      permanentTransaction.status = 'in_ledger';
      const result = await voteInteractor.isValid(permanentTransaction);
      expect(result).toEqual(false);
    });
  });
});

class EmailProviderMock implements EmailProvider {
  sendFailProcessingVoteEmail(email: string): void {
  }

  sendProcessingVoteEmail(email: string): void {
  }

  sendSuccessfulVoteEmail(email: string, ballot: Ballot): void {
  }

}

class BlockchainProviderMock implements BlockchainProvider {
  createTransaction(
    blockchainMetadata: PermanentMetadata,
    passphrase: string,
  ): Promise<any> {
    return Promise.resolve({ id: '1' });
  }

  createWallet(): Promise<any> {
    return Promise.resolve(undefined);
  }

  getAddressTransaction(walletId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getEstimationFee(walletToSendId: string, walletToReceiveId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getWallet(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  isFailedTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  isTransactionInLedger(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  listTransactions(walletId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  listWallets(): Promise<any> {
    return Promise.resolve(undefined);
  }

  removeTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  removeWallet(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}

class BlockchainFailMock implements BlockchainProvider {
  createTransaction(
    blockchainMetadata: PermanentMetadata,
    passphrase: string,
  ): Promise<any> {
    return Promise.reject(undefined);
  }

  createWallet(): Promise<any> {
    return Promise.resolve(undefined);
  }

  getEstimationFee(walletToSendId: string, walletToReceiveId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getWallet(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  isFailedTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  isTransactionInLedger(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(true);
  }

  listTransactions(walletId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  listWallets(): Promise<any> {
    return Promise.resolve(undefined);
  }

  removeTransaction(walletId: string, transactionId: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  removeWallet(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}

class ElectionLedgerMock implements ElectionLedger {
  add(electionId: number, voterId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  isRecorded(electionId: number, voterId: number): Promise<boolean> {
    return Promise.resolve(true);
  }

  remove(electionId: number, voterId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

}

class ElectionLedgerMockFalseRecorded implements ElectionLedger {
  add(electionId: number, voterId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  isRecorded(electionId: number, voterId: number): Promise<boolean> {
    return Promise.resolve(false);
  }

  remove(electionId: number, voterId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

}

class BallotRepositoryMock implements BallotRepository {
  save(ballot: Ballot): Promise<Ballot> {
    const b = new Ballot(null, null);
    ballot.id = 1;
    ballot.confirmationHash = 'hello world';
    return Promise.resolve(ballot);
  }

  update(ballot: Ballot): Promise<Ballot> {
    return Promise.resolve(undefined);
  }

  remove(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  findByPermanentId(id: string): Promise<Ballot> {
    const ballot = new Ballot(null, null);
    ballot.id = 1;
    ballot.confirmationHash = 'hello world';
    return Promise.resolve(ballot);
  }
}

class ElectionOptionRepositoryMock implements ElectionOptionRepository {
  save(
    electionOption: ElectionOption,
    electionId: number,
  ): Promise<ElectionOption> {
    return Promise.resolve(undefined);
  }

  getAll(electionId: number): Promise<ElectionOption[]> {
    return Promise.resolve([]);
  }

  getByChoiceId(electionId: number, choiceId: number): Promise<ElectionOption> {
    return Promise.resolve(undefined);
  }

  read(id: number): Promise<ElectionOption> {
    return Promise.resolve(undefined);
  }

  remove(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  update(electionOption: ElectionOption): Promise<ElectionOption> {
    return Promise.resolve(undefined);
  }

}

export class VoterRepoMock implements VoterRepository {
  async getByUser(userId: number): Promise<Voter> {
    const voter = new Voter('', '', '');
    voter.id = 4;
    return voter;
  }

  read(id: number): Promise<Voter> {
    return Promise.resolve(undefined);
  }

  save(voter: Voter): Promise<Voter> {
    return Promise.resolve(undefined);
  }
}

export class VoterRepoMockWithoutVoter implements VoterRepository {
  async getByUser(userId: number): Promise<Voter> {
    return Promise.resolve(undefined);
  }

  read(id: number): Promise<Voter> {
    return Promise.resolve(undefined);
  }

  save(voter: Voter): Promise<Voter> {
    return Promise.resolve(undefined);
  }
}

export class UserInteractorMock implements UserInteractor {
  create(user: User): Promise<User> {
    return Promise.resolve(undefined);
  }

  get(id: number): Promise<User> {
    return Promise.resolve(undefined);
  }
}


