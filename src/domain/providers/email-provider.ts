import { Ballot } from '../entities/ballot';

export interface EmailProvider {
  sendProcessingVoteEmail(email: string, ballot: Ballot): void;
  sendSuccessfulVoteEmail(email: string, ballot: Ballot): void;
  sendFailProcessingVoteEmail(email: string, ballot: Ballot): void;
}
