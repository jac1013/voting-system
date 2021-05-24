import { Ballot } from '../entities/ballot';

export interface BallotRepository {
  create(ballot: Ballot): Promise<Ballot>;
  update(ballot: Ballot): Promise<Ballot>;
  remove(id: number): Promise<void>;
}
