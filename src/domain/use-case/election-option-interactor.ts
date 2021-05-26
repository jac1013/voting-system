import { ElectionOption } from '../entities/election-option';
import { ElectionOptionRepository } from '../database/election-option-repository';

export interface ElectionOptionInteractor {
  create(
    electionOption: ElectionOption,
    electionId: number,
  ): Promise<ElectionOption>;
}

export class ElectionOptionInteractorImpl implements ElectionOptionInteractor {
  private electionOptionRepo: ElectionOptionRepository;

  constructor(electionOptionRepo: ElectionOptionRepository) {
    this.electionOptionRepo = electionOptionRepo;
  }

  async create(
    electionOption: ElectionOption,
    electionId: number,
  ): Promise<ElectionOption> {
    return this.electionOptionRepo.save(electionOption, electionId);
  }
}
