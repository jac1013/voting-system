import { Voter } from '../entities/voter';

export interface VoterRepository {
  create(voter: Voter, userId: number): Promise<Voter>;
  read(id: number): Promise<Voter>;
  getByUser(userId: number): Promise<Voter>;
}
