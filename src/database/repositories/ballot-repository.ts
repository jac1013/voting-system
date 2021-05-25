import { BallotRepository } from '../../domain/database/ballot-repository';
import { Ballot } from '../../domain/entities/ballot';
import { getConnection } from 'typeorm';
import { BallotORM } from '../entities/ballot-orm';
import { fromBallot, toBallot } from './mappers/ballot';

export class BallotRepositoryImpl implements BallotRepository {
  async save(ballot: Ballot): Promise<Ballot> {
    return toBallot(
      await getConnection().getRepository(BallotORM).save(fromBallot(ballot)),
    );
  }

  async update(ballot: Ballot): Promise<Ballot> {
    await getConnection().getRepository(BallotORM).update(ballot.id, ballot);
    return ballot;
  }

  async remove(id: number): Promise<void> {
    const ballot = getConnection().getRepository(BallotORM).create();
    ballot.id = id;
    await getConnection().getRepository(BallotORM).remove(ballot);
  }
}
