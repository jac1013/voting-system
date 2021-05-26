import { User } from '../entities/user';
import { UserRepository } from '../database/user-repository';

export interface UserInteractor {
  create(user: User): Promise<User>;
}

export class UserInteractorImpl implements UserInteractor {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }
}
