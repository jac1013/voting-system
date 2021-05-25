import { BlockchainProvider } from '../domain/providers/blockchain-provider';
import { Ballot } from '../domain/entities/ballot';

export class CardanoProvider implements BlockchainProvider {
  async createTransaction(ballot: Ballot): Promise<any> {
    const passphrase = 'tangocrypto';

    const unusedAddress = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );
    const addresses = [unusedAddress.id];
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
    console.log(information);

    const address = await this.getAddressTransaction(
      '399998782afc4f0b04fcc6db163d5fdd4f780425',
    );
    console.log(address);
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
}
