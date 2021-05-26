import { User } from './user';

export class Voter {
  id?: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  user: User;

  constructor(nationalId: string, firstName: string, lastName: string) {
    this.nationalId = nationalId;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
