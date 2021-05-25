import { Voter } from '../entities/voter';

export interface VoterRepository {
  save(voter: Voter): Promise<Voter>;
  read(id: number): Promise<Voter>;
  getByUser(userId: number): Promise<Voter>;
}
