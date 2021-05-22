import { Vote } from './vote';
import * as moment from 'moment';
import { Voter } from './voter';

describe('Vote', () => {
  let vote: Vote;
  let voter: Voter;

  beforeEach(() => {
    voter = new Voter('', '', '');
    vote = new Vote(voter);
  });

  describe('construction/vote casting', () => {
    it('should have the created date set to now when created', () => {
      expect(vote.created).toEqual(moment.utc().format());
    });
  });

  describe('cast()', () => {
    it('should set the provided option to the vote', () => {
      vote.cast(1);
      expect(vote.option).toEqual(1);
    });
  });
});
