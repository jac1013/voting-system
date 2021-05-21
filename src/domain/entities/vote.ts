import { Election } from './election';
import * as moment from 'moment';
import { Identifier } from './util/identifier';

export class Vote extends Identifier {
  created: string;
  election: Election;
  option: number;
  externalId?: string;

  constructor(election: Election, option: number) {
    super();
    this.election = election;
    this.created = moment.utc().format();
    this.option = option;
  }
}
