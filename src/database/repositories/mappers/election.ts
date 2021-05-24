import { Election } from '../../../domain/entities/election';
import { ElectionORM } from '../../entities/election-orm';
import { getConnection } from 'typeorm';
import { fromOptions, toOptions } from './election-option';
import { fromVotes, toVotes } from './voter';
import { ElectionOptionORM } from '../../entities/election-option-orm';
import { ElectionOption } from '../../../domain/entities/election-option';
import * as _ from 'lodash';

export function toElection(e: ElectionORM): Election {
  const election = new Election(e.startDate, e.endDate);
  election.id = e.id;
  election.isActive = e.isActive;
  election.startedDate = e.startedDate;
  election.endedDate = e.endedDate;
  election.options = toOptions(e.options);
  election.voters = toVotes(e.voters);
  return election;
}

export function fromElection(e: Election): ElectionORM {
  const election = getConnection().getRepository(ElectionORM).create();
  election.id = e.id;
  election.startDate = e.startDate;
  election.endDate = e.endDate;
  election.isActive = e.isActive;
  election.startedDate = e.startedDate;
  election.endedDate = e.endedDate;
  election.options = fromOptions(e.options);
  election.voters = fromVotes(e.voters);
  return election;
}

export function toElections(es: ElectionORM[]): Election[] {
  return _.map(es, (e) => {
    return toElection(e);
  });
}

export function fromElections(es: Election[]): ElectionORM[] {
  return _.map(es, (e) => {
    return fromElection(e);
  });
}

