import { BlockchainProvider } from '../domain/providers/blockchain-provider';
import { Ballot } from '../domain/entities/ballot';
import { AddressWallet } from 'cardano-wallet-js';

const PENDING = 'pending';
const IN_LEDGER = 'in_ledger';

export class CardanoProvider implements BlockchainProvider {
  async createTransaction(ballot: Ballot): Promise<any> {
    const passphrase = 'tangocrypto';

    const unusedAddress = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );
    const addresses = [new AddressWallet(unusedAddress.id)];
    const amounts = [1000000]; // 1 ADA

    const wallet = await this.getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );
    // TODO: this requires fixes in the library: https://github.com/tango-crypto/cardano-wallet-js/issues/4
    const transaction = await wallet.sendPayment(
      passphrase,
      addresses,
      amounts,
    );

    console.log(transaction);
  }

  //WalletIds:
  // 71f542fc82787ba100235cebb7ecbf135db00be8
  // 399998782afc4f0b04fcc6db163d5fdd4f780425
  constructor() {

  }

  async test() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init('http://localhost:8090/v2');
    const information = await walletServer.getNetworkInformation();

    await this.createTransaction(null);
  }

  async createWallet() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Seed, WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init('http://localhost:8090/v2');
    const recoveryPhrase = Seed.generateRecoveryPhrase();
    const mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
    const passphrase = 'tangocrypto';
    const name = 'tangocrypto-wallet';
    const wallet = await walletServer.createOrRestoreShelleyWallet(
      name,
      mnemonic_sentence,
      passphrase,
    );

    console.log(wallet);
  }

  async listWallets() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init('http://localhost:8090/v2');
    const wallets = await walletServer.wallets();
    console.log(wallets);
  }

  async getWallet(id: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WalletServer } = require('cardano-wallet-js');
    const walletServer = WalletServer.init('http://localhost:8090/v2');
    return await walletServer.getShelleyWallet(id);
  }

  async removeWallet(id: string) {
    const wallet = await this.getWallet(id);
    await wallet.delete();
  }

  async listTransactions(walletId: string): Promise<any> {
    const wallet = await this.getWallet(walletId);
    // get all wallet transactions
    const transactions = await wallet.getTransactions();
    console.log(transactions);
  }

  async getAddressTransaction(walletId: string): Promise<any> {
    const wallet = await this.getWallet(walletId);
    const addresses = await wallet.getUnusedAddresses();
    return addresses.slice(0, 1)[0];
  }

  async getEstimationFee(walletToSendId: string, walletToReceiveId: string) {
    const unusedAddress = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );

    const wallet = await this.getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );

    // TODO: this requires fixes in the library: https://github.com/tango-crypto/cardano-wallet-js/issues/4
    const estimatedFees = await wallet.estimateFee([unusedAddress.id], [1000000]);

    console.log(estimatedFees);
  }

  async getTransaction(walletId: string, id: string): Promise<any> {
    const wallet = await this.getWallet(
      '71f542fc82787ba100235cebb7ecbf135db00be8',
    );
    const tx = await wallet.getTransaction(
      'bc663f4735feb7772276f8eb6ff9d16b07162b4d3e9bf68ac67febe8e106a87f',
    );
    console.log(tx);
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
    const wallet = await this.getWallet(walletId);
    await wallet.forgetTransaction(transactionId);
  }
}
