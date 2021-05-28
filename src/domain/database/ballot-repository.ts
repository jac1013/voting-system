import { Ballot } from '../entities/ballot';

export interface BallotRepository {
  save(ballot: Ballot): Promise<Ballot>;
  update(ballot: Ballot): Promise<Ballot>;
  remove(id: number): Promise<void>;
  findByPermanentId(id: string): Promise<Ballot>;
}
