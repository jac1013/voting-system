import { VoterMap } from '../entities/voter-map';
import { User } from '../entities/user';
import { Election } from '../entities/election';

export interface VoteInteractor {
  vote(voter: User, choiceId: number): Promise<void>;
}

export class VoteInteractorImpl implements VoteInteractor {
  private voterMap: VoterMap;
  private election: Election;


  constructor(election: Election, voterMap: VoterMap) {
    this.voterMap = voterMap;
    this.election = election;
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
    // create ballot
    // save information about voterMap
    // send email letting the user know that the vote is processing
    // send email to inform the user that the vote is processed
    // in case of an error, inform the user through an email and revert everything
    // Create transaction in Blockchain for this particular vote
    //
    return Promise.resolve(undefined);
  }
}

export class VoteWithoutActiveElectionError {}
export class UserWithoutVoterProfileError {}
export class VoterNotAllowedError {}
export class OptionNotPresentInElectionError {}
