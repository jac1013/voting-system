import * as moment from 'moment';

export class Vote {
  id?: number;
  created: string;
  option: number;
  permanentId?: string;

  constructor() {
    this.created = moment.utc().format();
  }

  cast(option: number) {
    this.option = option;
  }
}
