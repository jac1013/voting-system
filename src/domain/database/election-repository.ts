import { Election } from '../entities/election';

export interface ElectionRepository {
  save(election: Election): Promise<Election>;
  remove(id: number): Promise<void>;
  getAll(): Promise<Election[]>;
}
