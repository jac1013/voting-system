import {
  OptionNotPresentInElectionError,
  UserWithoutVoterProfileError,
  VoteInteractor,
  VoteInteractorImpl, VoterNotAllowedError,
  VoteWithoutActiveElectionError
} from './vote-interactor';
import { VoterMap } from '../entities/voter-map';
import { Election } from '../entities/election';
import * as moment from 'moment';
import { User } from '../entities/user';
import { ElectionOption } from '../entities/election-option';
import { Voter } from '../entities/voter';

describe('VoteInteractor', () => {
  let election: Election;
  let voteInteractor: VoteInteractor;
  let voterMap: VoterMap;
  let user: User;
  let option: ElectionOption;
  let option2: ElectionOption;


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
    voteInteractor = new VoteInteractorImpl(election, voterMap);
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
  });
});
