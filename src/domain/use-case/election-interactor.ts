import { Election } from '../entities/election';
import { ElectionRepository } from '../database/election-repository';

export interface ElectionInteractor {
  create(election: Election): Promise<Election>;
  remove(id: number): Promise<void>;
  getAll(): Promise<Election[]>;
  start(electionId: number): Promise<Election>;
}

export class ElectionInteractorImpl implements ElectionInteractor {
  private electionRepo: ElectionRepository;

  constructor(electionRepo: ElectionRepository) {
    this.electionRepo = electionRepo;
  }

  async create(election: Election): Promise<Election> {
    return this.electionRepo.save(election);
  }

  getAll(): Promise<Election[]> {
    return Promise.resolve([]);
  }

  remove(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  async start(electionId: number): Promise<Election> {
    const election = await this.electionRepo.get(electionId);
    election.start();
    return await this.electionRepo.save(election);
  }
}
