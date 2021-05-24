import * as moment from 'moment';
import { Voter } from './voter';
import { ElectionOption } from './election-option';
import { Election } from './election';

export class Ballot {
  id?: number;
  created: string;
  option: ElectionOption;
  permanentId?: string;
  voter: Voter;
  election: Election;

  constructor(voter: Voter, choiceId, election: Election) {
    this.created = moment.utc().format();
    this.voter = voter;
    this.option = choiceId;
    this.election = election;
  }

  cast(permanentId: string) {
    this.permanentId = permanentId;
  }
}
