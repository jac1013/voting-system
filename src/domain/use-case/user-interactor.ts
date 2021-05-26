import { User } from '../entities/user';
import { UserRepository } from '../database/user-repository';

export interface UserInteractor {
  create(user: User): Promise<User>;
  get(id: number): Promise<User>;
}

export class UserInteractorImpl implements UserInteractor {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async get(id: number): Promise<User> {
    return this.userRepo.read(id);
  }
}
