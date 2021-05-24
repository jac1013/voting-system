import { ElectionOptionRepository } from '../../domain/database/election-option-repository';
import { ElectionOption } from '../../domain/entities/election-option';
import { getConnection } from 'typeorm';
import { ElectionORM } from '../entities/election-orm';
import { ElectionOptionORM } from '../entities/election-option-orm';
import { fromOption, toOption, toOptions } from './mappers/election-option';

export class ElectionOptionRepositoryImpl implements ElectionOptionRepository {
  async create(
    electionOption: ElectionOption,
    electionId: number,
  ): Promise<ElectionOption> {
    const o = fromOption(electionOption);
    o.election = getConnection().getRepository(ElectionORM).create();
    o.election.id = electionId;
    return toOption(
      await getConnection()
        .getRepository(ElectionOptionORM)
        .save(fromOption(electionOption)),
    );
  }

  async getAll(electionId: number): Promise<ElectionOption[]> {
    const e = getConnection().getRepository(ElectionORM).create();
    e.id = electionId;
    return toOptions(
      await getConnection()
        .getRepository(ElectionOptionORM)
        .find({ election: e }),
    );
  }

  async read(id: number): Promise<ElectionOption> {
    return toOption(
      await getConnection().getRepository(ElectionOptionORM).findOne({ id }),
    );
  }

  async remove(id: number): Promise<void> {
    const electionOption = getConnection()
      .getRepository(ElectionOptionORM)
      .create();
    electionOption.id = id;
    await getConnection()
      .getRepository(ElectionOptionORM)
      .remove(electionOption);
  }

  async update(electionOption: ElectionOption): Promise<ElectionOption> {
    await getConnection()
      .getRepository(ElectionOptionORM)
      .update(electionOption.id, electionOption);
    return electionOption;
  }
}
