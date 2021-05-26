import { ElectionRepository } from '../../domain/database/election-repository';
import { Election } from '../../domain/entities/election';
import { getConnection } from 'typeorm';
import { ElectionORM } from '../entities/election-orm';
import { fromElection, toElection, toElections } from './mappers/election';

export class ElectionRepositoryImpl implements ElectionRepository {
  async save(election: Election): Promise<Election> {
    return toElection(
      await getConnection()
        .getRepository(ElectionORM)
        .save(fromElection(election)),
    );
  }

  async getAll(): Promise<Election[]> {
    return toElections(await getConnection().getRepository(ElectionORM).find());
  }

  async remove(id: number): Promise<void> {
    const election = getConnection().getRepository(ElectionORM).create();
    election.id = id;
    await getConnection().getRepository(ElectionORM).remove(election);
  }

  async get(id: number): Promise<Election> {
    return toElection(
      await getConnection().getRepository(ElectionORM).findOne(id),
    );
  }
}
