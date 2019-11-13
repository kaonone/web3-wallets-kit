import WalletConnectProvider from '@walletconnect/web3-provider';
import { Provider } from 'web3/providers';
import Web3 from 'web3';
import { Bitski } from 'bitski';

export interface ConnectResult {
  web3: Web3;
  account: string;
}

interface GenericWallet<T extends string, P = void> {
  type: T;
  payload: P;
  provider: Provider;
}

export type Wallet =
  // | WalletDetail<'portis'>
  // | WalletDetail<'fortmatic'>
  // | WalletDetail<'squarelink'>
  | GenericWallet<'wallet-connect', WalletConnectProvider>
  // | WalletDetail<'torus'>
  | GenericWallet<'bitski', Bitski>
  // | WalletDetail<'ledger'>
  | GenericWallet<'metamask'>;

export type ExtractWallet<T extends WalletType> = Extract<Wallet, GenericWallet<T, any>>;

type MaybePromise<T> = T | Promise<T>;

export type WalletType = Wallet['type'];

type Resolver<D extends GenericWallet<string>> = {
  initialize(): MaybePromise<D>;
  destroy(details: D): MaybePromise<void>;
};

export type Resolvers = {
  [key in WalletType]: Resolver<ExtractWallet<key>>;
};
