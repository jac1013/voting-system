import { VoterRepository } from '../../domain/database/voter-repository';
import { Voter } from '../../domain/entities/voter';
import { getConnection } from 'typeorm';
import { VoterORM } from '../entities/voter-orm';
import { fromVoter, toVoter } from './mappers/voter';

export class VoterRepositoryImpl implements VoterRepository {
  async save(voter: Voter): Promise<Voter> {
    return toVoter(
      await getConnection().getRepository(VoterORM).save(fromVoter(voter)),
    );
  }

  // TODO: I have no idea if this will work
  async getByUser(userId: number): Promise<Voter> {
    return toVoter(
      (await getConnection()
        .getRepository('voter')
        .createQueryBuilder()
        .where('voter.userId = :id', { id: userId })
        .getOne()) as VoterORM,
    );
  }

  async read(id: number): Promise<Voter> {
    return toVoter(
      await getConnection().getRepository(VoterORM).findOne({ id }),
    );
  }
}
