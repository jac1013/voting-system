import { ElectionOption } from './election-option';
import * as moment from 'moment';
import * as _ from 'lodash';

export class Election {
  id?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  options: ElectionOption[];
  startedDate: string;
  endedDate: string;

  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.options = [];
  }

  start() {
    this.startedDate = moment.utc().format();
    this.isActive = true;
  }

  end() {
    this.endedDate = moment.utc().format();
    this.isActive = false;
  }

  addOption(option: ElectionOption) {
    this.options.push(option);
  }

  removeOption(choiceId: number) {
    _.remove(this.options, (o: ElectionOption) => {
      return o.choiceId === choiceId;
    });
  }
}
