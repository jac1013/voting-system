import { User } from '../entities/user';
import { Election } from '../entities/election';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';
import { ElectionLedger } from '../database/election-ledger';
import { BallotRepository } from '../database/ballot-repository';
import { ElectionOptionRepository } from '../database/election-option-repository';

export interface VoteInteractor {
  vote(voter: User, choiceId: number): Promise<void>;
}

export class VoteInteractorImpl implements VoteInteractor {
  private electionLedger: ElectionLedger;
  private readonly election: Election;
  private emailProvider: EmailProvider;
  private blockchainProvider: BlockchainProvider;
  private ballotRepo: BallotRepository;
  private electionOptionRepo: ElectionOptionRepository;

  constructor(
    election: Election,
    electionLedger: ElectionLedger,
    emailProvider: EmailProvider,
    blockchainProvider: BlockchainProvider,
    ballotRepo: BallotRepository,
    electionOptionRepo: ElectionOptionRepository,
  ) {
    this.electionLedger = electionLedger;
    this.election = election;
    this.emailProvider = emailProvider;
    this.blockchainProvider = blockchainProvider;
    this.ballotRepo = ballotRepo;
    this.electionOptionRepo = electionOptionRepo;
  }

  async vote(user: User, choiceId: number): Promise<void> {
    this.checkActiveElection();
    await this.checkVoterPermissions(user);
    this.checkOptionPresentInElection(choiceId);

    await this.electionLedger.add(this.election.id, user.voter.id);

    const option = await this.electionOptionRepo.getByChoiceId(
      this.election.id,
      choiceId,
    );
    let ballot = new Ballot(option, this.election);
    ballot = await this.ballotRepo.save(ballot);

    this.emailProvider.sendProcessingVoteEmail(user.email, ballot);

    return this.blockchainProvider
      .createTransaction(ballot)
      .then(async (transaction) => {
        ballot.permanentId = transaction.id;
        await this.ballotRepo.update(ballot);
        this.emailProvider.sendSuccessfulVoteEmail(user.email, ballot);
      })
      .catch(async () => {
        await this.electionLedger.remove(this.election.id, user.voter.id);
        await this.ballotRepo.remove(ballot.id);
        this.emailProvider.sendFailProcessingVoteEmail(user.email, ballot);
      });
  }

  private checkActiveElection() {
    if (this.election.isNotStarted() || this.election.isEnded()) {
      throw new VoteWithoutActiveElectionError();
    }
  }

  private async checkVoterPermissions(user: User) {
    if (
      user.voter === undefined ||
      (await this.electionLedger.isRecorded(this.election.id, user.voter.id))
    ) {
      throw new VoterNotAllowedError();
    }
  }

  private checkOptionPresentInElection(choiceId: number) {
    if (!this.election.hasOption(choiceId)) {
      throw new OptionNotPresentInElectionError();
    }
  }
}

export class VoteWithoutActiveElectionError {}
export class VoterNotAllowedError {}
export class OptionNotPresentInElectionError {}
