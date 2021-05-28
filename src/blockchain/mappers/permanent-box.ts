import { ShelleyWallet } from 'cardano-wallet-js/wallet/shelley-wallet';
import { PermanentBox } from '../../domain/entities/permanent-box';
import * as _ from 'lodash';

export function toPermanentBox(
  wallet: ShelleyWallet,
  passphrase: string,
): PermanentBox {
  const box = new PermanentBox();
  box.id = wallet.id;
  box.password = passphrase;
  return box;
}

export function toPermanentBoxes(wallets: ShelleyWallet[]): PermanentBox[] {
  return _.map(wallets, (w) => {
    return toPermanentBox(w, '');
  });
}
