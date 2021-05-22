import * as moment from 'moment';
import { Voter } from './voter';

export class Vote {
  id?: number;
  created: string;
  option: number;
  permanentId?: string;
  voter: Voter;

  constructor(voter: Voter) {
    this.created = moment.utc().format();
    this.voter = voter;
  }

  cast(option: number) {
    this.option = option;
  }
}
