import { getConnection } from 'typeorm';
import { VoterORM } from '../../entities/voter-orm';
import { Voter } from '../../../domain/entities/voter';
import * as _ from 'lodash';

export function toVoter(v: VoterORM): Voter {
  const voter = new Voter(v.nationalId, v.firstName, v.lastName);
  voter.id = v.id;
  voter.user = v.user;
  return voter;
}

export function fromVoter(v: Voter): VoterORM {
  const voter = getConnection().getRepository(VoterORM).create();
  voter.id = v.id;
  voter.nationalId = v.nationalId;
  voter.firstName = v.firstName;
  voter.lastName = v.lastName;
  voter.user = v.user;
  return voter;
}

export function toVoters(es: VoterORM[]): Voter[] {
  return _.map(es, (e) => {
    return toVoter(e);
  });
}

export function fromVoters(es: Voter[]): VoterORM[] {
  return _.map(es, (e) => {
    return fromVoter(e);
  });
}
