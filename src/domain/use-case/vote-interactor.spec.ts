import {
  OptionNotPresentInElectionError,
  VoteInteractor,
  VoteInteractorImpl,
  VoterNotAllowedError,
  VoteWithoutActiveElectionError,
} from './vote-interactor';
import { VoterMap } from '../entities/voter-map';
import { Election } from '../entities/election';
import * as moment from 'moment';
import { User } from '../entities/user';
import { ElectionOption } from '../entities/election-option';
import { Voter } from '../entities/voter';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';

describe('VoteInteractor', () => {
  let election: Election;
  let voteInteractor: VoteInteractor;
  let voterMap: VoterMap;
  let user: User;
  let option: ElectionOption;
  let option2: ElectionOption;
  let emailMock: EmailProvider;
  let blockchainMock: BlockchainProvider;

  beforeEach(() => {
    election = new Election(
      moment.utc().format(),
      moment.utc().add(1, 'days').format(),
    );
    option = new ElectionOption(1, 'president 1');
    option2 = new ElectionOption(2, 'president 2');
    election.addOption(option);
    election.addOption(option2);
    voterMap = new VoterMap(1, [1, 2, 3]);
    emailMock = new EmailProviderMock();
    blockchainMock = new BlockchainProviderMock();
    voteInteractor = new VoteInteractorImpl(
      election,
      voterMap,
      emailMock,
      blockchainMock,
    );
    user = new User('some@email.com');
    user.voter = new Voter('', '', '');
    user.voter.id = 4;
    election.start();
  });

  describe('vote()', () => {
    it('should return an error if the election is not active', () => {
      election.end();
      expect(() => {
        voteInteractor.vote(user, 1);
      }).toThrow(VoteWithoutActiveElectionError);
    });
    it('should return an error if the user has no voter profile in it', () => {
      const userWithoutVoter = new User('some@email.com');
      expect(() => {
        voteInteractor.vote(userWithoutVoter, 1);
      }).toThrow(VoterNotAllowedError);
    });
    it('should return an error if the choiceId of the option is not present in the election', () => {
      expect(() => {
        voteInteractor.vote(user, 3);
      }).toThrow(OptionNotPresentInElectionError);
    });
    it('should set the voter as alreadyVoted in voterMap', () => {
      voteInteractor.vote(user, 1);
      expect(voterMap.alreadyVoted(4)).toEqual(true);
    });
    it('should send an email letting the user know that the vote is processing', () => {
      const spy = jest.spyOn(emailMock, 'sendProcessingVoteEmail');
      voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should try to create the transaction in the blockchain network', () => {
      const spy = jest.spyOn(blockchainMock, 'createTransaction');
      voteInteractor.vote(user, 1);
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
        voterMap,
        emailMock,
        new BlockchainFailMock(),
      );
      const spy = jest.spyOn(emailMock, 'sendFailProcessingVoteEmail');
      await voteInteractor.vote(user, 1);
      expect(spy).toHaveBeenCalled();
    });
    it('should set the voter as it didnt vote if the blockchain process fails', async () => {
      voteInteractor = new VoteInteractorImpl(
        election,
        voterMap,
        emailMock,
        new BlockchainFailMock(),
      );
      await voteInteractor.vote(user, 1);
      expect(voterMap.alreadyVoted(4)).toEqual(false);
    });
  });
});

class EmailProviderMock implements EmailProvider {
  sendProcessingVoteEmail(email: string, ballot: Ballot): void {}
  sendSuccessfulVoteEmail(email: string, ballot: Ballot): void {}
  sendFailProcessingVoteEmail(email: string, ballot: Ballot): void {}
}

class BlockchainProviderMock implements BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<void> {
    return Promise.resolve(undefined);
  }
}

class BlockchainFailMock implements BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<void> {
    return Promise.reject(undefined);
  }
}
