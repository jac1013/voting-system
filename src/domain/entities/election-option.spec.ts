import { Vote } from './vote';
import { Election } from './election';

describe('Vote', () => {
  let vote: Vote;
  let election: Election;

  beforeEach(() => {
    election = new Election();
    vote = new Vote(election, 1);
  });

  describe('construction of option', () => {
    it('should have an internal id when created"', () => {
      expect(vote.id).not.toBeNull();
    });
  });
});
