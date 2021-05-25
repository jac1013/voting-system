import { Ballot } from '../entities/ballot';

export interface EmailProvider {
  sendProcessingVoteEmail(email: string): void;
  sendSuccessfulVoteEmail(email: string, ballot: Ballot): void;
  sendFailProcessingVoteEmail(email: string): void;
}
