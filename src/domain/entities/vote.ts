import { Election } from './election';
import * as moment from 'moment';

export class Vote {
  id?: number;
  created: string;
  election: Election;
  option: number;
  permanentId?: string;

  constructor(election: Election, option: number) {
    this.election = election;
    this.created = moment.utc().format();
    this.option = option;
  }
}
