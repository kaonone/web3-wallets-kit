import './@types';

type MaybePromise<T> = T | Promise<T>;

export interface DefaultConnectionPayload {
  provider: any;
}

export interface Connector<P extends DefaultConnectionPayload = DefaultConnectionPayload> {
  connect(): MaybePromise<P>;
  disconnect(): MaybePromise<void>;
  getAccount(): Promise<string | null>;
  getChainId(): Promise<number | null>;
  getConnectionPayload(): P | null;
}
