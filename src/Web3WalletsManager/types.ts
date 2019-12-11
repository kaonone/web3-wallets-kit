import WalletConnectProvider, {
  ProviderOptions as WalletConnectProviderConfig,
} from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { Provider } from 'web3/providers';
import { Bitski, BitskiSDKOptions } from 'bitski';
import { O } from 'ts-toolbelt';

export type ConnectionStatus = 'disconnected' | 'pending' | 'connected';

export interface ConnectResult {
  web3: Web3;
  account: string;
}

export type ConnectionDetails<T extends WalletType> = {
  wallet: T;
  provider: Provider;
} & (InitializationResult<T> extends null
  ? {}
  : {
      payload: InitializationResult<T>;
    });

export type ConnectionDetailsUnion<T extends WalletType = WalletType> = T extends WalletType
  ? ConnectionDetails<T>
  : never;

// type: [InitializationResult, InitializationConfig]
interface WalletsSignatures {
  'wallet-connect': [WalletConnectProvider, WalletConnectProviderConfig];
  bitski: [Bitski, BitskiConfig];
  metamask: [null, null];
  // portis: [null, null];
  // fortmatic: [null, null];
  // squarelink: [null, null];
  // torus: [null, null];
  // ledger: [null, null];
}

export type WalletType = keyof WalletsSignatures;

type InitializationResult<K extends WalletType> = WalletsSignatures[K][0];
type InitializationConfig<K extends WalletType> = WalletsSignatures[K][1];

type MaybePromise<T> = T | Promise<T>;

export type Resolver<D extends WalletType> = {
  initialize(config: InitializationConfig<D>): MaybePromise<ConnectionDetails<D>>;
  destroy(details: ConnectionDetails<D>): MaybePromise<void>;
};

export type Resolvers = {
  [key in WalletType]: Resolver<key>;
};

/* *** Wallet Configs *** */

export type WalletConfigs = O.Filter<
  {
    [T in WalletType]: InitializationConfig<T>;
  },
  null
>;

interface BitskiConfig {
  clientId: string;
  redirectUri: string;
  additionalScopes?: string[];
  options?: BitskiSDKOptions;
}

/* *** Other *** */

export interface MetamaskInpageProvider extends Provider {
  enable?(): Promise<void>;
}
