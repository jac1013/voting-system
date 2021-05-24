import { Ballot } from './ballot';
import * as moment from 'moment';
import { Voter } from './voter';
import { Election } from './election';
import { ElectionOption } from './election-option';

describe('Ballot', () => {
  let vote: Ballot;
  let electionOption: ElectionOption;
  let election: Election;

  beforeEach(() => {
    electionOption = new ElectionOption(1, '');
    election = new Election('', '');
    vote = new Ballot(electionOption, election);
  });

  describe('construction/vote casting', () => {
    it('should have the created date set to now when created', () => {
      expect(vote.created).toEqual(moment.utc().format());
    });
  });

  describe('cast()', () => {
    it('should set the provided option to the ballot', () => {
      vote.cast('1');
      expect(vote.permanentId).toEqual('1');
    });
  });
});
