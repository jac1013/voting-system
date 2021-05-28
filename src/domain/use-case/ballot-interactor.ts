import { User } from '../entities/user';
import { Election } from '../entities/election';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionLedger } from '../database/election-ledger';
import { BallotRepository } from '../database/ballot-repository';
import { ElectionOptionRepository } from '../database/election-option-repository';
import { VoterInteractor } from './voter-interactor';
import { Voter } from '../entities/voter';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export interface BallotInteractor {
  vote(user: User, choiceId: number): Promise<void>;
}

export class BallotInteractorImpl implements BallotInteractor {
  private electionLedger: ElectionLedger;
  private readonly election: Election;
  private emailProvider: EmailProvider;
  private blockchainProvider: BlockchainProvider;
  private ballotRepo: BallotRepository;
  private electionOptionRepo: ElectionOptionRepository;
  private voterInteractor: VoterInteractor;

  constructor(
    election: Election,
    electionLedger: ElectionLedger,
    emailProvider: EmailProvider,
    blockchainProvider: BlockchainProvider,
    ballotRepo: BallotRepository,
    electionOptionRepo: ElectionOptionRepository,
    voterInteractor: VoterInteractor,
  ) {
    this.electionLedger = electionLedger;
    this.election = election;
    this.emailProvider = emailProvider;
    this.blockchainProvider = blockchainProvider;
    this.ballotRepo = ballotRepo;
    this.electionOptionRepo = electionOptionRepo;
    this.voterInteractor = voterInteractor;
  }

  async vote(user: User, choiceId: number): Promise<void> {
    this.checkActiveElection();
    const voter = await this.checkVoterPermissions(user);
    this.checkOptionPresentInElection(choiceId);

    await this.electionLedger.add(this.election.id, voter.id);

    const option = await this.electionOptionRepo.getByChoiceId(
      this.election.id,
      choiceId,
    );
    let ballot = new Ballot(option, this.election);
    ballot = await this.ballotRepo.save(ballot);

    return this.blockchainProvider
      .createTransaction(ballot)
      .then(async (transaction) => {
        ballot.permanentId = transaction.id;
        await this.ballotRepo.update(ballot);
        await this.checkTransactionConfirmation(user, ballot);
      })
      .catch(async () => {
        // TODO: need to investigate reasons why we might end up here and correctly handle things in the blockchain provider
        await this.electionLedger.remove(this.election.id, voter.id);
        await this.ballotRepo.remove(ballot.id);
        this.emailProvider.sendFailProcessingVoteEmail(user.email);
      });
  }

  private checkActiveElection() {
    if (this.election.isNotStarted() || this.election.isEnded()) {
      throw new VoteWithoutActiveElectionError();
    }
  }

  private async checkVoterPermissions(user: User): Promise<Voter> {
    const voter = await this.voterInteractor.getByUserId(user.id);
    if (
      voter === undefined ||
      (await this.electionLedger.isRecorded(this.election.id, voter.id))
    ) {
      throw new VoterNotAllowedError();
    }
    return voter;
  }

  private checkOptionPresentInElection(choiceId: number) {
    if (!this.election.hasOption(choiceId)) {
      throw new OptionNotPresentInElectionError();
    }
  }

  private async checkTransactionConfirmation(
    user: User,
    ballot: Ballot,
  ): Promise<void> {
    const interval = setInterval(async () => {
      // TODO: What happens if we fail here
      // TODO: We need to have a time limit, if the transaction hangs in "pending" we should "forget" it from the blockchain
      // as that's the only way we get the transaction fee back.
      if (
        await this.blockchainProvider.isTransactionInLedger(
          this.election.votingBoxId,
          ballot.permanentId,
        )
      ) {
        await this.emailProvider.sendSuccessfulVoteEmail(user.email, ballot);
        clearInterval(interval);
      }
      // TODO: this is not safe, we could get something different than a number here.
    }, parseInt(process.env.BLOCKCHAIN_CONFIRMATION_INTERVAL_TIME_IN_MS));
  }
}

export class VoteWithoutActiveElectionError {}
export class VoterNotAllowedError {}
export class OptionNotPresentInElectionError {}
