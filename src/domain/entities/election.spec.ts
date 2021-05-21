import { Election } from './election';
import * as moment from 'moment';
import { ElectionOption } from './election-option';

describe('Election', () => {
  let election: Election;
  let startDate: string;
  let endDate: string;

  beforeEach(() => {
    startDate = moment.utc().format();
    endDate = moment.utc().add(1, 'days').format();
    election = new Election(startDate, endDate);
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
    beforeEach(() => {
      election.start();
    });
    it('should have a startedDate set to now', () => {
      expect(election.startedDate).toEqual(moment.utc().format());
    });
    it('should have isActive set to true', () => {
      expect(election.isActive).toEqual(true);
    });
  });

  describe('end()', () => {
    beforeEach(() => {
      election.end();
    });
    it('should have a endedDate set to now', () => {
      expect(election.endedDate).toEqual(moment.utc().format());
    });
    it('should have isActive set to false', () => {
      expect(election.isActive).toEqual(false);
    });
  });

  describe('addOption()', () => {
    let option: ElectionOption;
    beforeEach(() => {
      option = new ElectionOption(1, 'president 1', election);
      election.addOption(option);
    });
    it(`should have the added option in it's list`, () => {
      expect(election.options[0]).toBe(option);
    });
  });

  describe('removeOption()', () => {
    let option: ElectionOption;
    let option2: ElectionOption;
    let option3: ElectionOption;
    beforeEach(() => {
      option = new ElectionOption(1, 'president 1', election);
      option2 = new ElectionOption(2, 'president 2', election);
      option3 = new ElectionOption(3, 'president 3', election);
      election.addOption(option);
      election.addOption(option2);
      election.addOption(option3);
      election.removeOption(1);
    });
    it(`should remove the specified option from it's list`, () => {
      expect(election.options[0]).toBe(option2);
      expect(election.options[1]).toBe(option3);
    });
  });
});
