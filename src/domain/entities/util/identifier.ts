import { v4 as uuidv4 } from 'uuid';

export class Identifier {
  public id: string;

  constructor() {
    this.id = uuidv4();
  }
}
