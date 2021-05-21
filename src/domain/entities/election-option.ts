import { Election } from './election';
import { v4 as uuidv4 } from 'uuid';

export class ElectionOption {
  id: string;
  choiceId: number;
  title: string;
  election: Election;

  constructor(choiceId: number, title: string, election: Election) {
    this.id = uuidv4();
    this.choiceId = choiceId;
    this.title = title;
    this.election = election;
  }
}
