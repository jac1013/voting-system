import {
  OptionNotPresentInElectionError,
  VoteInteractor,
  VoteInteractorImpl,
  VoterNotAllowedError,
  VoteWithoutActiveElectionError,
} from './vote-interactor';
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

describe('VoteInteractor', () => {
  let election: Election;
  let voteInteractor: VoteInteractor;
  let electionLedger: ElectionLedger;
  let user: User;
  let option: ElectionOption;
  let option2: ElectionOption;
  let emailMock: EmailProvider;
  let blockchainMock: BlockchainProvider;
  let ballotRepository: BallotRepository;

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
    voteInteractor = new VoteInteractorImpl(
      election,
      new ElectionLedgerMockFalseRecorded(),
      emailMock,
      blockchainMock,
      ballotRepository,
    );
    user = new User('some@email.com');
    user.voter = new Voter('', '', '');
    user.voter.id = 4;
    election.start();
  });

  describe('vote()', () => {
    it('should return an error if the election is not active', () => {
      election.end();
      voteInteractor.vote(user, 1).catch((error) => {
        expect(error).toBeInstanceOf(VoteWithoutActiveElectionError);
      });
    });
    it('should return an error if the user has no voter profile in it', () => {
      const userWithoutVoter = new User('some@email.com');
      voteInteractor.vote(userWithoutVoter, 1).catch((error) => {
        expect(error).toBeInstanceOf(VoterNotAllowedError);
      });
    });
    it('should return an error if the choiceId of the option is not present in the election', () => {
      voteInteractor.vote(user, 1).catch((error) => {
        expect(error).toBeInstanceOf(OptionNotPresentInElectionError);
      });
    });
    it('should set the voter in this election ledger', async () => {
      await voteInteractor.vote(user, 1);
      const isRecorded = await electionLedger.isRecorded(1, 1);
      expect(isRecorded).toEqual(true);
    });
    it('should send an email letting the user know that the vote is processing', async () => {
      const spy = jest.spyOn(emailMock, 'sendProcessingVoteEmail');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should try to create the transaction in the blockchain network', async () => {
      const spy = jest.spyOn(blockchainMock, 'createTransaction');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should send an email when the transaction in the blockchain network is complete', async () => {
      const spy = jest.spyOn(emailMock, 'sendSuccessfulVoteEmail');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should send an email when the transaction in the blockchain fails', async () => {
      voteInteractor = new VoteInteractorImpl(
        election,
        new ElectionLedgerMockFalseRecorded(),
        emailMock,
        new BlockchainFailMock(),
        ballotRepository,
      );
      const spy = jest.spyOn(emailMock, 'sendFailProcessingVoteEmail');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalled();
    });
    it('should set the voter as it didnt vote if the blockchain process fails', async () => {
      electionLedger = new ElectionLedgerMockFalseRecorded();
      voteInteractor = new VoteInteractorImpl(
        election,
        electionLedger,
        emailMock,
        new BlockchainFailMock(),
        ballotRepository,
      );
      await voteInteractor.vote(user, 1);
      const isRecorded = await electionLedger.isRecorded(1, 1);
      expect(isRecorded).toEqual(false);
    });
    it('should create the ballot in a repository', async () => {
      const spy = jest.spyOn(ballotRepository, 'create');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should update the ballot with the permanentId when the blockchain transaction ends successfully', async () => {
      const spy = jest.spyOn(ballotRepository, 'update');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

class EmailProviderMock implements EmailProvider {
  sendProcessingVoteEmail(email: string, ballot: Ballot): void {}
  sendSuccessfulVoteEmail(email: string, ballot: Ballot): void {}
  sendFailProcessingVoteEmail(email: string, ballot: Ballot): void {}
}

class BlockchainProviderMock implements BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<any> {
    return Promise.resolve({ id: '1' });
  }
}

class BlockchainFailMock implements BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<void> {
    return Promise.reject(undefined);
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
  create(ballot: Ballot): Promise<Ballot> {
    return Promise.resolve(undefined);
  }

  update(ballot: Ballot): Promise<Ballot> {
    return Promise.resolve(undefined);
  }
}
