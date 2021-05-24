import { VoterRepository } from '../../domain/database/voter-repository';
import { Voter } from '../../domain/entities/voter';
import { fromElection, toElection } from './mappers/election';
import { getConnection } from 'typeorm';
import { VoterORM } from '../entities/voter-orm';
import { fromVoter, toVoter } from './mappers/voter';

export class VoterRepositoryImpl implements VoterRepository {
  async create(voter: Voter): Promise<Voter> {
    return toVoter(
      await getConnection().getRepository(VoterORM).save(fromVoter(voter)),
    );
  }

  getByUser(userId: number): Promise<Voter> {
    return Promise.resolve(undefined);
  }

  async read(id: number): Promise<Voter> {
    return toVoter(
      await getConnection().getRepository(VoterORM).findOne({ id }),
    );
  }
}
