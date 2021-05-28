import { PermanentMetadata } from './permanent-metadata';

// TODO: for now these are the same as cardano for simplicity
const PENDING = 'pending';
const IN_LEDGER = 'in_ledger';
export class PermanentTransaction {
  id: string;
  status: string;
  metadata: PermanentMetadata;

  isInLedger(): boolean {
    return this.status === IN_LEDGER;
  }
}
