import { Voter } from './voter';
import { Identifier } from './util/identifier';

export class User extends Identifier {
  email: string;
  voter?: Voter;

  constructor(email: string) {
    super();
    this.email = email;
  }
}
