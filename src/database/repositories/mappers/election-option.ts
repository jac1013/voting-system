import { ElectionOption } from '../../../domain/entities/election-option';
import { ElectionOptionORM } from '../../entities/election-option-orm';
import * as _ from 'lodash';

export function toOption(e: ElectionOptionORM): ElectionOption {
  const option = new ElectionOption(e.choiceId, e.title);
  option.id = e.id;
  return option;
}

export function fromOption(e: ElectionOption): ElectionOptionORM {
  const option = new ElectionOptionORM();
  option.id = e.id;
  option.choiceId = e.choiceId;
  option.title = e.title;
  return option;
}

export function toOptions(es: ElectionOptionORM[]): ElectionOption[] {
  return _.map(es, (e) => {
    return toOption(e);
  });
}

export function fromOptions(es: ElectionOption[]): ElectionOptionORM[] {
  return _.map(es, (e) => {
    return fromOption(e);
  });
}
