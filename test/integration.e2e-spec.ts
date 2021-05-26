import { ElectionInteractor } from '../src/domain/use-case/election-interactor';
import { ElectionOptionInteractor } from '../src/domain/use-case/election-option-interactor';
import { UserInteractor } from '../src/domain/use-case/user-interactor';
import { VoterInteractor } from '../src/domain/use-case/voter-interactor';
import * as chance from 'chance';

describe('Integration Test', () => {
  const electionInteractor: ElectionInteractor;
  const electionOptionInteractor: ElectionOptionInteractor;
  const userInteractor: UserInteractor;
  const voterInteractor: VoterInteractor;


  beforeAll(async () => {

  });

  it('test', () => {
    expect(1).toBe(1);
  });
});
