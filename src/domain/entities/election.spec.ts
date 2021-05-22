import {
  Election,
  EndBeforeStartError,
  StartAfterEndError,
  StartWithoutMinimumOptionsError,
} from './election';
import * as moment from 'moment';
import { ElectionOption } from './election-option';

describe('Election', () => {
  let election: Election;
  let startDate: string;
  let endDate: string;
  let option: ElectionOption;
  let option2: ElectionOption;
  let option3: ElectionOption;

  beforeEach(() => {
    startDate = moment.utc().format();
    endDate = moment.utc().add(1, 'days').format();
    election = new Election(startDate, endDate);
    option = new ElectionOption(1, 'president 1');
    option2 = new ElectionOption(2, 'president 2');
    option3 = new ElectionOption(3, 'president 3');
    election.addOption(option);
    election.addOption(option2);
    election.addOption(option3);
  });

  describe('construction', () => {
    it('should have the passed startDate when created', () => {
      expect(election.startDate).toBe(startDate);
    });
    it('should have the passed endDate when created', () => {
      expect(election.endDate).toBe(endDate);
    });
  });

  describe('start()', () => {
    it('should have a startedDate set to now', () => {
      election.start();
      expect(election.startedDate).toEqual(moment.utc().format());
    });
    it('should have isActive set to true', () => {
      election.start();
      expect(election.isActive).toEqual(true);
    });
    it('should not let us start if it is already ended', () => {
      election.start();
      election.end();
      expect(election.start.bind(election)).toThrow(StartAfterEndError);
    });
    it(`should not let us start if there aren't at least 2 options`, () => {
      election.removeOption(1);
      election.removeOption(2);
      expect(election.start.bind(election)).toThrow(
        StartWithoutMinimumOptionsError,
      );
    });
  });

  describe('end()', () => {
    it(`should not be ended if it is not started`, () => {
      expect(election.end.bind(election)).toThrow(EndBeforeStartError);
    });
    it('should have a endedDate set to now', () => {
      election.start();
      election.end();
      expect(election.endedDate).toEqual(moment.utc().format());
    });
    it('should have isActive set to false', () => {
      election.start();
      election.end();
      expect(election.isActive).toEqual(false);
    });
  });

  describe('addOption()', () => {
    it(`should have the added option in it's list`, () => {
      expect(election.options[0]).toBe(option);
    });
  });

  describe('removeOption()', () => {
    it(`should remove the specified option from it's list`, () => {
      election.removeOption(1);
      expect(election.options[0]).toBe(option2);
      expect(election.options[1]).toBe(option3);
    });
  });
});
