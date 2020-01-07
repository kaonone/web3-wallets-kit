import './@types';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
export type Provider = import('@web3-wallets-kit/for-third-library-definitions').Provider;

type MaybePromise<T> = T | Promise<T>;

export interface DefaultConnectionPayload {
  provider: Provider;
}

export interface Connector<P extends DefaultConnectionPayload = DefaultConnectionPayload> {
  connect(): MaybePromise<P>;
  disconnect(): MaybePromise<void>;
  getAccount(): Promise<string | null>;
  getConnectionPayload(): P | null;
}
