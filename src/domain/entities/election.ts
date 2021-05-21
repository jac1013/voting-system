import { ElectionOption } from './election-option';

export class Election {
  id: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  options: ElectionOption[];
}
