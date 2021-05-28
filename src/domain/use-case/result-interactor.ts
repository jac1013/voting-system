import { ElectionResult } from '../entities/election-result';
import { BlockchainProvider } from '../providers/blockchain-provider';

export interface ResultInteractor {
  compute(electionId: string): Promise<ElectionResult>;
}

export class ResultInteractorImpl implements ResultInteractor {
  private blockchainProvider: BlockchainProvider;


  constructor(blockchainProvider: BlockchainProvider) {
    this.blockchainProvider = blockchainProvider;
  }

  async compute(electionId: string): Promise<ElectionResult> {
    // find all transactions for election in blockchain
    const wallet = await this.blockchainProvider.getWallet(electionId);
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
