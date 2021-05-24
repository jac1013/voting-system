import { ElectionLedger } from '../../domain/database/election-ledger';
import { getConnection } from 'typeorm';
import { ElectionORM } from '../entities/election-orm';
import { VoterORM } from '../entities/voter-orm';
import * as _ from 'lodash';

export class ElectionLedgerImpl implements ElectionLedger {
  async add(electionId: number, voterId: number): Promise<void> {
    const election = new ElectionORM();
    election.id = electionId;
    const voter = new VoterORM();
    voter.id = voterId;
    election.voters = [voter];
    await getConnection().getRepository(ElectionORM).save(election);
  }

  // TODO: I'm not sure this works.
  async isRecorded(electionId: number, voterId: number): Promise<boolean> {
    const repo = getConnection().getRepository(ElectionORM);
    const election = await repo
      .createQueryBuilder()
      .where({ id: electionId })
      .leftJoinAndSelect('election.voters', 'voter')
      .getOne();

    return !!_.find(election.voters, (v) => {
      return v.id === voterId;
    });
  }

  // TODO: Don't know how to do this.
  remove(electionId: number, voterId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

}
