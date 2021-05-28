import { VoterORM } from '../../entities/voter-orm';
import { Voter } from '../../../domain/entities/voter';
import { UserORM } from '../../entities/user-orm';
import { User } from '../../../domain/entities/user';
import * as _ from 'lodash';

export function toUser(u: UserORM): User {
  const user = new User(u.email);
  user.id = u.id;
  return user;
}

export function fromUser(u: User): UserORM {
  const user = new UserORM();
  user.id = u.id;
  user.email = u.email;
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
