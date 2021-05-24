import { Election } from '../entities/election';

export interface ElectionInteractor {
  create(election: Election): Promise<Election>;
  remove(id: number): Promise<void>;
  getAll(): Promise<Election[]>;
}
