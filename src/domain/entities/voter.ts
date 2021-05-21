import { Identifier } from './util/identifier';

export class Voter extends Identifier {
  nationalId: string;
  firstName: string;
  lastName: string;

  constructor(nationalId: string, firstName: string, lastName: string) {
    super();
    this.nationalId = nationalId;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
