import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BallotRepositoryImpl } from './database/repositories/ballot-repository';
import { Ballot } from './domain/entities/ballot';
import { ElectionRepositoryImpl } from './database/repositories/election-repository';
import { Election } from './domain/entities/election';
import * as moment from 'moment';
import { ElectionOption } from './domain/entities/election-option';
import { ElectionOptionRepositoryImpl } from './database/repositories/election-option-repository';
import { UserRepositoryImpl } from './database/repositories/user-repository';
import { User } from './domain/entities/user';
import { VoterRepositoryImpl } from './database/repositories/voter-repository';
import { Voter } from './domain/entities/voter';
import { ElectionLedgerRepoImpl } from './database/repositories/election-ledger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async testDatabase(): Promise<string> {
    const electionRepo = new ElectionRepositoryImpl();
    let election = new Election(
      moment.utc().format(),
      moment.utc().add(1, 'days').format(),
    );
    election = await electionRepo.save(election);
    const electionOptionRepo = new ElectionOptionRepositoryImpl();
    let electionOption1 = new ElectionOption(1, 'president 1');
    let electionOption2 = new ElectionOption(2, 'president 2');
    electionOption1 = await electionOptionRepo.save(
      electionOption1,
      election.id,
    );
    electionOption2 = await electionOptionRepo.save(
      electionOption2,
      election.id,
    );
    election.addOption(electionOption1);
    election.addOption(electionOption2);
    election = await electionRepo.save(election);
    const ballotRepo = new BallotRepositoryImpl();
    const ballot = new Ballot(electionOption1, election);
    await ballotRepo.save(ballot);

    const userRepo = new UserRepositoryImpl();
    let user = new User('some@email.com');
    user = await userRepo.save(user);

    const voterRepo = new VoterRepositoryImpl();
    let voter = new Voter('', '', '');
    voter = await voterRepo.save(voter);

    voter.user = user;
    await userRepo.save(user);

    const electionLedgerRepo = new ElectionLedgerRepoImpl();
    await electionLedgerRepo.add(election.id, voter.id);

    console.log(await electionLedgerRepo.isRecorded(election.id, voter.id));

    await electionLedgerRepo.remove(election.id, voter.id);

    console.log(await electionLedgerRepo.isRecorded(election.id, voter.id));

    return 'Something happened!';
  }
}
