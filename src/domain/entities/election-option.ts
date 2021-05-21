import { Election } from './election';

export class ElectionOption {
  id?: number;
  choiceId: number;
  title: string;
  election: Election;

  constructor(choiceId: number, title: string, election: Election) {
    this.choiceId = choiceId;
    this.title = title;
    this.election = election;
  }
}
