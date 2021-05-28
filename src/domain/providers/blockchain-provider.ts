import { Ballot } from '../entities/ballot';

export interface BlockchainProvider {
  createTransaction(ballot: Ballot): Promise<any>;
  createWallet(): Promise<any>;
  listWallets(): Promise<any>;
  getWallet(id: string): Promise<any>;
  removeWallet(id: string): Promise<any>;
  listTransactions(walletId: string): Promise<any>;
  getAddressTransaction(walletId: string): Promise<any>;
  getEstimationFee(
    walletToSendId: string,
    walletToReceiveId: string,
  ): Promise<any>;
  getTransaction(walletId: string, transactionId: string): Promise<any>;
  isTransactionInLedger(walletId: string, transactionId: string): Promise<any>;
  isFailedTransaction(walletId: string, transactionId: string): Promise<any>;
  removeTransaction(walletId: string, transactionId: string): Promise<any>;
}
