import { VoteInteractor, VoteInteractorImpl, VoteWithoutActiveElectionError } from './vote-interactor';
import { VoterMap } from '../entities/voter-map';
import { Election } from '../entities/election';
import * as moment from 'moment';
import { User } from '../entities/user';
import { ElectionOption } from '../entities/election-option';

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
  });

  describe('vote()', () => {
    it('should return an error if the election is not active', () => {
      expect(voteInteractor.vote(user, 1)).toThrow(
        VoteWithoutActiveElectionError,
      );
    });
  });
});
