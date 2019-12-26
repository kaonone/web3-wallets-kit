import './@types';
import { Provider } from '@web3-wallets-kit/for-third-library-definitions';

export * from '@web3-wallets-kit/for-third-library-definitions';

type MaybePromise<T> = T | Promise<T>;

interface DefaultConnectionPayload {
  provider: Provider;
}

export interface Connector<P extends DefaultConnectionPayload = DefaultConnectionPayload> {
  connect(): MaybePromise<P>;
  disconnect(): MaybePromise<void>;
  getAccount(): Promise<string | null>;
  getConnectionPayload(): P | null;
}
