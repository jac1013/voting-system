import { ElectionLedger } from '../../domain/database/election-ledger';
import { getConnection } from 'typeorm';
import { ElectionORM } from '../entities/election-orm';
import { VoterORM } from '../entities/voter-orm';
import * as _ from 'lodash';

export class ElectionLedgerRepoImpl implements ElectionLedger {
  async add(electionId: number, voterId: number): Promise<void> {
    const election = new ElectionORM();
    election.id = electionId;
    const voter = new VoterORM();
    voter.id = voterId;
    election.voters = [voter];
    await getConnection().getRepository(ElectionORM).save(election);
  }

  async isRecorded(electionId: number, voterId: number): Promise<boolean> {
    const repo = getConnection().getRepository(ElectionORM);
    const ledger = await repo
      .createQueryBuilder('election')
      .leftJoinAndSelect('election.voters', 'voter')
      .where('election.id = :id and voter.id = :voter', {
        id: electionId,
        voter: voterId,
      })
      .getOne();

    return !!ledger;
  }

  async remove(electionId: number, voterId: number): Promise<void> {
    const repo = getConnection().getRepository(ElectionORM);
    const ledger = await repo
      .createQueryBuilder('election')
      .leftJoinAndSelect('election.voters', 'voter')
      .where('election.id = :id and voter.id = :voter', {
        id: electionId,
        voter: voterId,
      })
      .getOne();

    if (ledger) {
      ledger.voters = _.filter(ledger.voters, (v) => {
        return v.id !== voterId;
      });
      await getConnection().getRepository(ElectionORM).save(ledger);
    }
  }
}
