import { Voter } from '../entities/voter';
import { VoterRepository } from '../database/voter-repository';
import { UserInteractor } from './user-interactor';

export interface VoterInteractor {
  create(voter: Voter, userId: number): Promise<Voter>;
  getByUserId(userId: number): Promise<Voter>;
}

export class VoterInteractorImpl implements VoterInteractor {
  private voterRepo: VoterRepository;
  private userInteractor: UserInteractor;

  constructor(voterRepo: VoterRepository, userInteractor: UserInteractor) {
    this.voterRepo = voterRepo;
    this.userInteractor = userInteractor;
  }

  async create(voter: Voter, userId: number): Promise<Voter> {
    voter.user = await this.userInteractor.get(userId);
    return this.voterRepo.save(voter);
  }

  async getByUserId(userId: number): Promise<Voter> {
    return this.voterRepo.getByUser(userId);
  }
}
