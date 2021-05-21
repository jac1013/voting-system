import { Election } from './election';
import { Identifier } from './util/identifier';

export class ElectionOption extends Identifier {
  choiceId: number;
  title: string;
  election: Election;

  constructor(choiceId: number, title: string, election: Election) {
    super();
    this.choiceId = choiceId;
    this.title = title;
    this.election = election;
  }
}
