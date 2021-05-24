import { UserRepository } from '../../domain/database/user-repository';
import { User } from '../../domain/entities/user';
import { getConnection } from 'typeorm';
import { UserORM } from '../entities/user-orm';
import { fromUser, toUser } from './mappers/user';

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<User> {
    return toUser(
      await getConnection().getRepository(UserORM).save(fromUser(user)),
    );
  }

  async read(id: number): Promise<User> {
    return toUser(await getConnection().getRepository(UserORM).findOne({ id }));
  }
}
