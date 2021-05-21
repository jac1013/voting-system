import { Vote } from './vote';
import { Election } from './election';
import * as moment from 'moment';

describe('Vote', () => {
  let vote: Vote;
  let election: Election;

  beforeEach(() => {
    election = new Election();
    vote = new Vote(election, 1);
  });

  describe('construction/vote casting', () => {
    it('should have the passed option when created"', () => {
      expect(vote.option).toBe(1);
    });
    it('should have the passed election when created"', () => {
      expect(vote.election).toBe(election);
    });
    it('should have the created date set to now when created"', () => {
      expect(vote.created).toEqual(moment.utc().format());
    });
  });
});
