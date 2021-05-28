import { PermanentBox } from '../entities/permanent-box';
import { PermanentTransaction } from '../entities/permanent-transaction';
import { PermanentMetadata } from '../entities/permanent-metadata';
import { ElectionResult } from '../entities/election-result';

export interface BlockchainProvider {
  createTransaction(
    metadata: PermanentMetadata | ElectionResult,
    passphrase: string,
  ): Promise<PermanentTransaction>;
  createWallet(): Promise<PermanentBox>;
  listWallets(): Promise<PermanentBox[]>;
  getWallet(id: string): Promise<PermanentBox>;
  removeWallet(id: string): Promise<void>;
  listTransactions(walletId: string): Promise<PermanentTransaction[]>;
  getTransaction(
    boxId: string,
    transactionId: string,
  ): Promise<PermanentTransaction>;
  isTransactionInLedger(boxId: string, transactionId: string): Promise<boolean>;
  isFailedTransaction(boxId: string, transactionId: string): Promise<boolean>;
  removeTransaction(boxId: string, transactionId: string): Promise<void>;
}
