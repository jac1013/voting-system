import { VoterMap } from '../entities/voter-map';
import { User } from '../entities/user';
import { Election } from '../entities/election';
import { EmailProvider } from '../providers/email-provider';
import { Ballot } from '../entities/ballot';
import { BlockchainProvider } from '../providers/blockchain-provider';

export interface VoteInteractor {
  vote(voter: User, choiceId: number): Promise<void>;
}

export class VoteInteractorImpl implements VoteInteractor {
  private voterMap: VoterMap;
  private election: Election;
  private emailProvider: EmailProvider;
  private blockchainProvider: BlockchainProvider;

  constructor(
    election: Election,
    voterMap: VoterMap,
    emailProvider: EmailProvider,
    blockchainProvider: BlockchainProvider,
  ) {
    this.voterMap = voterMap;
    this.election = election;
    this.emailProvider = emailProvider;
    this.blockchainProvider = blockchainProvider;
  }

  vote(user: User, choiceId: number): Promise<void> {
    if (this.election.isNotStarted() || this.election.isEnded()) {
      throw new VoteWithoutActiveElectionError();
    }

    if (user.voter === undefined || this.voterMap.alreadyVoted(user.voter.id)) {
      throw new VoterNotAllowedError();
    }

    if (!this.election.hasOption(choiceId)) {
      throw new OptionNotPresentInElectionError();
    }

    this.voterMap.voted(user.voter.id);

    const ballot = new Ballot(user.voter, choiceId);

    this.emailProvider.sendProcessingVoteEmail(user.email, ballot);

    return this.blockchainProvider
      .createTransaction(ballot)
      .then(() => {
        this.emailProvider.sendSuccessfulVoteEmail(user.email, ballot);
      })
      .catch(() => {
        this.emailProvider.sendFailProcessingVoteEmail(user.email, ballot);
        this.voterMap.remove(user.voter.id);
      });

    // create ballot
    // save information about voterMap
    // send email letting the user know that the vote is processing
    // send email to inform the user that the vote is processed
    // in case of an error, inform the user through an email and revert everything
    // Create transaction in Blockchain for this particular vote
    //
  }
}

export class VoteWithoutActiveElectionError {}
export class VoterNotAllowedError {}
export class OptionNotPresentInElectionError {}
