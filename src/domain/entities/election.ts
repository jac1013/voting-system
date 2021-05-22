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
    if (this.isEnded()) {
      throw new StartAfterEndError();
    }

    if (this.hasLessThanTwoOptions()) {
      throw new StartWithoutMinimumOptionsError();
    }

    this.startedDate = moment.utc().format();
    this.isActive = true;
  }

  private isEnded() {
    return this.endedDate !== undefined && !this.isActive;
  }

  private hasLessThanTwoOptions(): boolean {
    return this.options.length < 2;
  }

  end() {
    if (!this.isStarted()) {
      throw new EndBeforeStartError();
    }
    this.endedDate = moment.utc().format();
    this.isActive = false;
  }

  private isStarted() {
    return this.startedDate !== undefined && this.isActive;
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

export class EndBeforeStartError {
}

export class StartAfterEndError {
}

export class StartWithoutMinimumOptionsError {
}
