import { VoterORM } from '../../entities/voter-orm';
import { Voter } from '../../../domain/entities/voter';
import { getConnection } from 'typeorm';
import * as _ from 'lodash';
import { Ballot } from '../../../domain/entities/ballot';
import { BallotORM } from '../../entities/ballot-orm';
import { fromOption, toOption } from './election-option';
import { fromElection, toElection } from './election';

export function toBallot(b: BallotORM): Ballot {
  const ballot = new Ballot(toOption(b.option), toElection(b.election));
  ballot.id = b.id;
  return ballot;
}

export function fromBallot(b: Ballot): BallotORM {
  const ballot = getConnection().getRepository(BallotORM).create();
  ballot.id = b.id;
  ballot.created = b.created;
  ballot.option = fromOption(b.option);
  ballot.permanentId = b.permanentId;
  ballot.election = fromElection(b.election);
  return ballot;
}

export function toBallots(es: VoterORM[]): Voter[] {
  return _.map(es, (e) => {
    return toBallot(e);
  });
}

export function fromBallots(es: Voter[]): VoterORM[] {
  return _.map(es, (e) => {
    return fromBallot(e);
  });
}
