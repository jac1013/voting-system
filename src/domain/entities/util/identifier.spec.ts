import { Identifier } from './identifier';

describe('User', () => {
  let identifier: Identifier;

  beforeEach(() => {
    identifier = new Identifier();
  });

  describe('construction', () => {
    it('should have an internal id when created"', () => {
      expect(identifier.id).not.toBeNull();
    });
  });
});
