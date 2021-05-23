import { Voter } from '../entities/voter';
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
    // election must be active
    if (this.election.isNotStarted() || this.election.isEnded()) {
      throw new VoteWithoutActiveElectionError();
    }
    // validate that the user has a voter profile
    // validate that the choiceId is present in the election
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
