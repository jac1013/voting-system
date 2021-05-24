import { Ballot } from '../entities/ballot';

export interface BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<any>;
}
