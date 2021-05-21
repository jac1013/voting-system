import { Election } from './election';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class Vote {
  created: string;
  election: Election;
  option: number;
  id: string;
  externalId?: string;

  constructor(election: Election, option: number) {
    this.election = election;
    this.id = uuidv4();
    this.created = moment.utc().format();
    this.option = option;
  }
}
