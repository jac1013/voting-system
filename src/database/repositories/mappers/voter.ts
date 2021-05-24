import { getConnection } from 'typeorm';
import { VoterORM } from '../../entities/voter-orm';
import { Voter } from '../../../domain/entities/voter';
import * as _ from 'lodash';

export function toVote(v: VoterORM): Voter {
  const voter = new Voter(v.nationalId, v.firstName, v.lastName);
  voter.id = v.id;
  return voter;
}

export function fromVote(v: Voter): VoterORM {
  const voter = getConnection().getRepository(VoterORM).create();
  voter.id = v.id;
  voter.nationalId = v.nationalId;
  voter.firstName = v.firstName;
  voter.lastName = v.lastName;
  return voter;
}

export function toVotes(es: VoterORM[]): Voter[] {
  return _.map(es, (e) => {
    return toVote(e);
  });
}

export function fromVotes(es: Voter[]): VoterORM[] {
  return _.map(es, (e) => {
    return fromVote(e);
  });
}
