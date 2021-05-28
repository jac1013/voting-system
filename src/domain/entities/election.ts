import { ElectionOption } from './election-option';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Voter } from './voter';

export class Election {
  id?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  options: ElectionOption[];
  startedDate: string;
  endedDate: string;
  voters: Voter[];
  votingBoxId: string;
  resultId: string;

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

  isEnded() {
    return (
      this.endedDate !== undefined &&
      this.endedDate !== null &&
      this.isActive !== undefined &&
      this.isActive !== null &&
      !this.isActive
    );
  }

  private hasLessThanTwoOptions(): boolean {
    return this.options.length < 2;
  }

  end() {
    if (this.isNotStarted()) {
      throw new EndBeforeStartError();
    }
    this.endedDate = moment.utc().format();
    this.isActive = false;
  }

  isNotStarted() {
    return !this.isStarted();
  }

  private isStarted() {
    return this.startedDate !== undefined && this.isActive;
  }

  addOption(option: ElectionOption) {
    if (this.isStarted()) {
      throw new AddOptionOnStartedElectionError();
    }
    this.options.push(option);
  }

  removeOption(choiceId: number) {
    if (this.isStarted()) {
      throw new RemoveOptionOnStartedElection();
    }
    _.remove(this.options, (o: ElectionOption) => {
      return o.choiceId === choiceId;
    });
  }

  hasOption(option: number): boolean {
    return !!_.find(this.options, (o: ElectionOption) => {
      return o.choiceId === option;
    });
  }
}

export class EndBeforeStartError {}
export class StartAfterEndError {}
export class StartWithoutMinimumOptionsError {}
export class AddOptionOnStartedElectionError {}
export class RemoveOptionOnStartedElection {}
