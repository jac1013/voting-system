import { TransactionWallet } from 'cardano-wallet-js/wallet/transaction-wallet';
import { PermanentTransaction } from '../../domain/entities/permanent-transaction';
import * as _ from 'lodash';

export function toPermanentTransaction(
  tx: TransactionWallet,
): PermanentTransaction {
  const transaction = new PermanentTransaction();
  transaction.id = tx.id;
  transaction.metadata = tx.metadata;
  transaction.status = tx.status;
  return transaction;
}

export function toPermanentTransactions(txs: TransactionWallet[]) {
  return _.map(txs, (tx) => {
    return toPermanentTransaction(tx);
  });
}
