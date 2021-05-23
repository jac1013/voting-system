import { User } from '../entities/user';
import { Election } from '../entities/election';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionLedger } from '../database/election-ledger';

export interface VoteInteractor {
  vote(voter: User, choiceId: number): Promise<void>;
}

export class VoteInteractorImpl implements VoteInteractor {
  private electionLedger: ElectionLedger;
  private election: Election;
  private emailProvider: EmailProvider;
  private blockchainProvider: BlockchainProvider;

  constructor(
    election: Election,
    electionLedger: ElectionLedger,
    emailProvider: EmailProvider,
    blockchainProvider: BlockchainProvider,
  ) {
    this.electionLedger = electionLedger;
    this.election = election;
    this.emailProvider = emailProvider;
    this.blockchainProvider = blockchainProvider;
  }

  async vote(user: User, choiceId: number): Promise<void> {
    if (this.election.isNotStarted() || this.election.isEnded()) {
      throw new VoteWithoutActiveElectionError();
    }

    if (
      user.voter === undefined ||
      (await this.electionLedger.isRecorded(this.election.id, user.voter.id))
    ) {
      throw new VoterNotAllowedError();
    }

    if (!this.election.hasOption(choiceId)) {
      throw new OptionNotPresentInElectionError();
    }

    await this.electionLedger.add(this.election.id, user.voter.id);

    const ballot = new Ballot(user.voter, choiceId);

    this.emailProvider.sendProcessingVoteEmail(user.email, ballot);

    return this.blockchainProvider
      .createTransaction(ballot)
      .then(() => {
        this.emailProvider.sendSuccessfulVoteEmail(user.email, ballot);
      })
      .catch(async () => {
        this.emailProvider.sendFailProcessingVoteEmail(user.email, ballot);
        await this.electionLedger.remove(this.election.id, user.voter.id);
      });
  }
}

export class VoteWithoutActiveElectionError {}
export class VoterNotAllowedError {}
export class OptionNotPresentInElectionError {}
