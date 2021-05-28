import * as moment from 'moment';
import { ElectionOption } from './election-option';
import { Election } from './election';

export class Ballot {
  id?: number;
  created: string;
  option: ElectionOption;
  permanentId?: string;
  election: Election;
  confirmationHash: string;

  constructor(electionOption: ElectionOption, election: Election) {
    this.created = moment.utc().format();
    this.option = electionOption;
    this.election = election;
  }

  cast(permanentId: string) {
    this.permanentId = permanentId;
  }
}
