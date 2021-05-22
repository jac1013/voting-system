import { VoterMap } from './voter-map';

describe('VoterMap', () => {
  let voterMap: VoterMap;

  beforeEach(() => {
    voterMap = new VoterMap(1, [1, 2, 3]);
  });

  describe('construction', () => {
    it('should initialize the internal with voters provided', () => {
      expect(voterMap.voters).not.toBeUndefined();
    });
  });

  describe('alreadyVoted()', () => {
    it('should return true if the voter is in the map', () => {
      expect(voterMap.alreadyVoted(1)).toEqual(true);
    });
    it('should return false if the voter is not in the map', () => {
      expect(voterMap.alreadyVoted(4)).toEqual(false);
    });
  });
});
