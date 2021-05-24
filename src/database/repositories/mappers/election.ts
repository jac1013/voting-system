import { Election } from '../../../domain/entities/election';
import { ElectionORM } from '../../entities/election-orm';
import { getConnection } from 'typeorm';
import { fromOptions, toOptions } from './election-option';
import * as _ from 'lodash';
import { toVoters, fromVoters } from './voter';

export function toElection(e: ElectionORM): Election {
  const election = new Election(e.startDate, e.endDate);
  election.id = e.id;
  election.isActive = e.isActive;
  election.startedDate = e.startedDate;
  election.endedDate = e.endedDate;
  election.options = toOptions(e.options);
  election.voters = toVoters(e.voters);
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
  election.voters = fromVoters(e.voters);
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

