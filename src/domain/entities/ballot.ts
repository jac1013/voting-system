import * as moment from 'moment';
import { Voter } from './voter';

export class Ballot {
  id?: number;
  created: string;
  option: number;
  permanentId?: string;
  voter: Voter;

  constructor(voter: Voter, choiceId) {
    this.created = moment.utc().format();
    this.voter = voter;
    this.option = choiceId;
  }

  cast(permanentId: string) {
    this.permanentId = permanentId
  }
}
