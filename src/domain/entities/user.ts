import { Voter } from './voter';

export class User {
  id?: number;
  email: string;
  voter?: Voter;

  constructor(email: string) {
    this.email = email;
  }
}
