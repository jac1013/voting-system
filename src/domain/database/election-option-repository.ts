import { ElectionOption } from '../entities/election-option';

export interface ElectionOptionRepository {
  save(
    electionOption: ElectionOption,
    electionId: number,
  ): Promise<ElectionOption>;
  update(electionOption: ElectionOption): Promise<ElectionOption>;
  remove(id: number): Promise<void>;
  read(id: number): Promise<ElectionOption>;
  getAll(electionId: number): Promise<ElectionOption[]>;
  getByChoiceId(electionId: number, choiceId: number): Promise<ElectionOption>;
}
