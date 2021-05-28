import { ElectionResult } from '../entities/election-result';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionInteractor } from './election-interactor';
import { BallotInteractor } from './ballot-interactor';
import * as _ from 'lodash';
import { ElectionOption } from '../entities/election-option';

export interface ResultInteractor {
  compute(electionId: number): Promise<ElectionResult>;
}

export class ResultInteractorImpl implements ResultInteractor {
  private blockchainProvider: BlockchainProvider;
  private electionInteractor: ElectionInteractor;
  private ballotInteractor: BallotInteractor;

  constructor(
    blockchainProvider: BlockchainProvider,
    electionInteractor: ElectionInteractor,
    ballotInteractor: BallotInteractor,
  ) {
    this.blockchainProvider = blockchainProvider;
    this.electionInteractor = electionInteractor;
    this.ballotInteractor = ballotInteractor;
  }

  async compute(electionId: number): Promise<ElectionResult> {
    const election = await this.electionInteractor.get(electionId);
    // TODO: naming for the interface might have to be improved;
    const options = election.options;
    const resultHolder = new ElectionResult();

    _.each(options, (o: ElectionOption) => {
      resultHolder.results[o.choiceId.toString()] = 0;
    });

    const wallet = await this.blockchainProvider.getWallet(
      election.votingBoxId,
    );
    const transactions = await this.blockchainProvider.listTransactions(
      wallet.id,
    );

    for (let i = 0; i < transactions.length; i++) {
      if (await this.ballotInteractor.isValid(transactions[i])) {
        resultHolder.results[transactions[i].metadata.choiceId.toString()] += 1;
      }
    }

    const tx = await this.blockchainProvider.createTransaction(
      resultHolder,
      process.env.TEST_WALLET_SECRET,
    );

    election.resultId = tx.id;
    await this.electionInteractor.update(election);

    return resultHolder;
  }
}
