import { BlockchainProvider } from '../domain/providers/blockchain-provider';
import { Ballot } from '../domain/entities/ballot';
import { AddressWallet, ShelleyWallet } from 'cardano-wallet-js';
import { PermanentTransaction } from '../domain/entities/permanent-transaction';
import {
  toPermanentTransaction,
  toPermanentTransactions,
} from './mappers/transaction';
import { PermanentBox } from '../domain/entities/permanent-box';
import { toPermanentBox, toPermanentBoxes } from './mappers/permanent-box';
import { PermanentMetadata } from '../domain/entities/permanent-metadata';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const PENDING = 'pending';
const IN_LEDGER = 'in_ledger';

export class CardanoProvider implements BlockchainProvider {
  async createTransaction(
    metadata: PermanentMetadata,
    passphrase: string,
  ): Promise<PermanentTransaction> {
    // TODO: we need a more robust way of handling passphrases
    const unusedAddress = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );
    const addresses = [new AddressWallet(unusedAddress.id)];
    const amounts = [1000000]; // 1 ADA

    const wallet = await this._getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );
    // TODO: this requires fixes in the library: https://github.com/tango-crypto/cardano-wallet-js/issues/4
    const transaction = await wallet.sendPayment(
      passphrase,
      addresses,
      amounts,
      { o: metadata.choiceId, i: metadata.iv, c: metadata.content },
    );

    console.log(transaction);
    return toPermanentTransaction(transaction);
  }

  //WalletIds:
  // 71f542fc82787ba100235cebb7ecbf135db00be8
  // 399998782afc4f0b04fcc6db163d5fdd4f780425
  constructor() {}

  async test() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const { WalletServer } = require('cardano-wallet-js');
    // const walletServer = WalletServer.init('http://localhost:8090/v2');
    // const information = await walletServer.getNetworkInformation();

    await this.createTransaction(null, process.env.TEST_WALLET_SECRET);
  }

  async createWallet(): Promise<PermanentBox> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Seed, WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init(process.env.CARDANO_NETWORK_URL);
    const recoveryPhrase = Seed.generateRecoveryPhrase();
    const mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
    const passphrase = process.env.TEST_WALLET_SECRET;
    const name = 'tangocrypto-wallet';
    const wallet = await walletServer.createOrRestoreShelleyWallet(
      name,
      mnemonic_sentence,
      passphrase,
    );

    console.log(wallet);
    return toPermanentBox(wallet, passphrase);
  }

  async listWallets(): Promise<PermanentBox[]> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init(process.env.CARDANO_NETWORK_URL);
    const wallets = await walletServer.wallets();
    console.log(wallets);
    return toPermanentBoxes(wallets);
  }

  async getWallet(id: string): Promise<PermanentBox> {
    // TODO: this can be simplified or requires more thought.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init(process.env.CARDANO_NETWORK_URL);
    const wallet = await walletServer.getShelleyWallet(id);
    return toPermanentBox(wallet, '');
  }

  async _getWallet(id: string): Promise<ShelleyWallet> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init(process.env.CARDANO_NETWORK_URL);
    return await walletServer.getShelleyWallet(id);
  }

  async removeWallet(id: string): Promise<void> {
    const wallet = await this._getWallet(id);
    await wallet.delete();
  }

  async listTransactions(walletId: string): Promise<PermanentTransaction[]> {
    const wallet = await this._getWallet(walletId);
    // get all wallet transactions
    const transactions = await wallet.getTransactions();
    console.log(transactions);
    return toPermanentTransactions(transactions);
  }

  async getAddressTransaction(walletId: string): Promise<any> {
    const wallet = await this._getWallet(walletId);
    const addresses = await wallet.getUnusedAddresses();
    return addresses.slice(0, 1)[0];
  }

  async getEstimationFee(walletToSendId: string, walletToReceiveId: string) {
    const unusedAddress = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );

    const wallet = await this._getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );

    // TODO: this requires fixes in the library: https://github.com/tango-crypto/cardano-wallet-js/issues/4
    const estimatedFees = await wallet.estimateFee(
      [unusedAddress.id],
      [1000000],
    );

    console.log(estimatedFees);
  }

  async getTransaction(
    boxId: string,
    id: string,
  ): Promise<PermanentTransaction> {
    const wallet = await this._getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );
    const tx = await wallet.getTransaction(
      'bc663f4735feb7772276f8eb6ff9d16b07162b4d3e9bf68ac67febe8e106a87f',
    );
    console.log(tx);
    return toPermanentTransaction(tx);
  }

  async isTransactionInLedger(
    walletId: string,
    transactionId: string,
  ): Promise<boolean> {
    const transaction = await this.getTransaction(walletId, transactionId);
    return transaction.status === IN_LEDGER;
  }

  async isFailedTransaction(
    walletId: string,
    transactionId: string,
  ): Promise<boolean> {
    const transaction = await this.getTransaction(walletId, transactionId);
    if (transaction.status !== PENDING && transaction.status !== IN_LEDGER) {
      //TODO: Configure a real logger
      console.log(
        `transaction status is not recognized: ${transaction.status}`,
      );
      return false;
    }
  }

  async removeTransaction(
    walletId: string,
    transactionId: string,
  ): Promise<void> {
    const wallet = (await this._getWallet(walletId)) as any;
    await wallet.forgetTransaction(transactionId);
  }
}
