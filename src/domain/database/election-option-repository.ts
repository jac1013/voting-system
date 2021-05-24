import { ElectionOption } from '../entities/election-option';

export interface ElectionOptionRepository {
  create(electionOption: ElectionOption): Promise<ElectionOption>;
  update(electionOption: ElectionOption): Promise<ElectionOption>;
  remove(id: number): Promise<void>;
  read(id: number): Promise<ElectionOption>;
  getAll(electionId: number): Promise<ElectionOption[]>;
}
