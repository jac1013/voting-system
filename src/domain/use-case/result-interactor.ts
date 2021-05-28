import { ElectionResult } from '../entities/election-result';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionInteractor } from './election-interactor';

export interface ResultInteractor {
  compute(electionId: number): Promise<ElectionResult>;
}

export class ResultInteractorImpl implements ResultInteractor {
  private blockchainProvider: BlockchainProvider;
  private electionInteractor: ElectionInteractor;


  constructor(
    blockchainProvider: BlockchainProvider,
    electionInteractor: ElectionInteractor,
  ) {
    this.blockchainProvider = blockchainProvider;
    this.electionInteractor = electionInteractor;
  }

  async compute(electionId: number): Promise<ElectionResult> {
    // find all transactions for election in blockchain
    const election = await this.electionInteractor.get(electionId);
    // TODO: naming for the interface might have to be improved;
    const wallet = await this.blockchainProvider.getWallet(
      election.votingBoxId,
    );
    const transactions = await this.blockchainProvider.listTransactions(
      wallet.id,
    );
    // iterate them
    for (const transaction in transactions) {
      
    }
    // check that the transaction is legit with the confirmation hash in the database
    // count all valid votes and show the results for each option
    // save results in blockchain through metadata
    // save result transaction ID in database
  }
}
