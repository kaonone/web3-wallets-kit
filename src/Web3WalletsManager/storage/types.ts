import { WalletType } from '../types';

export interface PayloadByKey {
  __web3wm_connectedWallet__: WalletType;
}

export type StorageKey = keyof PayloadByKey;
