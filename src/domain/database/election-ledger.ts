export interface ElectionLedger {
  add(electionId: number, voterId: number): Promise<void>;
  remove(electionId: number, voterId: number): Promise<void>;
  isRecorded(electionId: number, voterId: number): Promise<boolean>;
}
