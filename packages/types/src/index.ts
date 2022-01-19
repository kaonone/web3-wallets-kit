import './@types';

import type { Provider } from '@web3-wallets-kit/for-third-library-definitions';

export { Provider };

type MaybePromise<T> = T | Promise<T>;

export interface DefaultConnectionPayload {
  provider: Provider;
}

export interface Connector<P extends DefaultConnectionPayload = DefaultConnectionPayload> {
  connect(): MaybePromise<P>;
  disconnect(): MaybePromise<void>;
  getAccount(): Promise<string | null>;
  getChainId(): Promise<number | null>;
  getConnectionPayload(): P | null;
  subscribeConnectAccount(callback: ConnectCallback): SubscribedObject;
  subscribeChainId(callback: ChainIdCallback): SubscribedObject;
  subscribeDisconnect(callback: DisconnectCallback): SubscribedObject;
}

export type SubscribedObject = { unsubscribe: () => void };
export type ConnectCallback = (account: string) => void;
export type ChainIdCallback = (chainId: number) => void;
export type DisconnectCallback = (error?: any) => void;
