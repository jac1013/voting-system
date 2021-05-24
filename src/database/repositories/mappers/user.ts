import { getConnection } from 'typeorm';
import { VoterORM } from '../../entities/voter-orm';
import { Voter } from '../../../domain/entities/voter';
import { UserORM } from '../../entities/user-orm';
import { User } from '../../../domain/entities/user';
import { fromVoter, toVoter } from './voter';
import * as _ from 'lodash';

export function toUser(u: UserORM): User {
  const user = new User(u.email);
  user.id = u.id;
  user.voter = toVoter(u.voter);
  return user;
}

export function fromUser(u: User): UserORM {
  const user = getConnection().getRepository(UserORM).create();
  user.id = u.id;
  user.email = u.email;
  user.voter = fromVoter(u.voter);
  return user;
}

export function toUsers(es: VoterORM[]): Voter[] {
  return _.map(es, (e) => {
    return toUser(e);
  });
}

export function fromUsers(es: Voter[]): VoterORM[] {
  return _.map(es, (e) => {
    return fromUsers(e);
  });
}
