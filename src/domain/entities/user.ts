import { Voter } from './voter';

export class User {
  id?: string;
  email: string;
  voter?: Voter;

  constructor(email: string) {
    this.email = email;
  }
}
