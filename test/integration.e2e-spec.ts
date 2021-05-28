import { ElectionInteractor, ElectionInteractorImpl } from '../src/domain/use-case/election-interactor';
import {
  ElectionOptionInteractor,
  ElectionOptionInteractorImpl
} from '../src/domain/use-case/election-option-interactor';
import { UserInteractor, UserInteractorImpl } from '../src/domain/use-case/user-interactor';
import { VoterInteractor, VoterInteractorImpl } from '../src/domain/use-case/voter-interactor';
import * as chance from 'chance';
import { Election } from '../src/domain/entities/election';
import * as moment from 'moment';
import { ElectionRepositoryImpl } from '../src/database/repositories/election-repository';
import { CardanoProvider } from '../src/blockchain/cardano';
import { ElectionOption } from '../src/domain/entities/election-option';
import { ElectionOptionRepositoryImpl } from '../src/database/repositories/election-option-repository';
import { UserRepositoryImpl } from '../src/database/repositories/user-repository';
import { VoterRepositoryImpl } from '../src/database/repositories/voter-repository';
import { User } from '../src/domain/entities/user';
import { Voter } from '../src/domain/entities/voter';
import { BallotInteractor, BallotInteractorImpl } from '../src/domain/use-case/ballot-interactor';
import { ElectionLedgerRepoImpl } from '../src/database/repositories/election-ledger';
import { NodeMailerProvider } from '../src/emails/node-mailer';
import { BallotRepositoryImpl } from '../src/database/repositories/ballot-repository';

describe('Integration Test', () => {
  let electionInteractor: ElectionInteractor;
  let electionOptionInteractor: ElectionOptionInteractor;
  let userInteractor: UserInteractor;
  let voterInteractor: VoterInteractor;
  let ballotInteractor: BallotInteractor;

  it('Ballot.vote() use case', async () => {
    electionInteractor = new ElectionInteractorImpl(
      new ElectionRepositoryImpl(),
      new CardanoProvider(),
    );

    electionOptionInteractor = new ElectionOptionInteractorImpl(
      new ElectionOptionRepositoryImpl(),
    );
    userInteractor = new UserInteractorImpl(new UserRepositoryImpl());
    voterInteractor = new VoterInteractorImpl(
      new VoterRepositoryImpl(),
      userInteractor,
    );

    let election = new Election(
      moment.utc().format(),
      moment.utc().add(1, 'days').format(),
    );

    election = await electionInteractor.create(election);
    election = await electionInteractor.start(election.id);

    let optionOne = new ElectionOption(1, chance.name());
    optionOne = await electionOptionInteractor.create(optionOne, election.id);
    let optionTwo = new ElectionOption(2, chance.name());
    optionTwo = await electionOptionInteractor.create(optionTwo, election.id);
    let optionThree = new ElectionOption(3, chance.name());
    optionThree = await electionOptionInteractor.create(
      optionThree,
      election.id,
    );
    let optionFour = new ElectionOption(4, chance.name());
    optionFour = await electionOptionInteractor.create(optionFour, election.id);
    let optionFive = new ElectionOption(5, chance.name());
    optionFive = await electionOptionInteractor.create(optionFive, election.id);
    let optionSix = new ElectionOption(6, chance.name());
    optionSix = await electionOptionInteractor.create(optionSix, election.id);

    election.addOption(optionOne);
    election.addOption(optionTwo);
    election.addOption(optionThree);
    election.addOption(optionFour);
    election.addOption(optionFive);
    election.addOption(optionSix);

    election = await electionInteractor.update(election);

    const users = [];

    for (let i = 0; i < 20; i++) {
      const user = new User(process.env.TEST_EMAIL_RECEIVE_ADDRESS);
      users.push(await userInteractor.create(user));
    }

    const voters = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const voter = new Voter(
        chance.ssn({ dashes: false }),
        chance.name(),
        chance.name(),
      );
      voters.push(await voterInteractor.create(voter, user.id));
    }

    ballotInteractor = new BallotInteractorImpl(
      election,
      new ElectionLedgerRepoImpl(),
      new NodeMailerProvider(),
      new CardanoProvider(),
      new BallotRepositoryImpl(),
      new ElectionOptionRepositoryImpl(),
      voterInteractor,
    );

    for (let i = 0; i < users.length; i++) {
      await ballotInteractor.vote(users[i], chance.natural({ min: 1, max: 6 }));
    }

    election = await electionInteractor.end(election.id);
    console.log(election);
  });
});
