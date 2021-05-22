import { Vote } from './vote';
import * as moment from 'moment';

describe('Vote', () => {
  let vote: Vote;

  beforeEach(() => {
    vote = new Vote();
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
