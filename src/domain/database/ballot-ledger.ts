export interface BallotLedger {
  add(electionId: number, ballotId: number): Promise<void>;
  remove(electionId: number, ballotId: number): Promise<void>;
}
