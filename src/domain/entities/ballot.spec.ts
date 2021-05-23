import { Ballot } from './ballot';
import * as moment from 'moment';
import { Voter } from './voter';

describe('Ballot', () => {
  let vote: Ballot;
  let voter: Voter;

  beforeEach(() => {
    voter = new Voter('', '', '');
    vote = new Ballot(voter, 1);
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
