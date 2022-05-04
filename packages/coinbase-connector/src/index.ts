/* eslint-disable import/no-duplicates */
import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import type CoinbaseWalletSDKClass from '@coinbase/wallet-sdk';
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import {
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';

type CoinbaseWalletSDKOptions = ConstructorParameters<typeof CoinbaseWalletSDKClass>[0];

export interface CoinbaseConnectionPayload extends DefaultConnectionPayload {
  provider: CoinbaseWalletProvider;
  coinbase: CoinbaseWalletSDKClass;
}

export interface CoinbaseConnectorConfig extends CoinbaseWalletSDKOptions {
  jsonRpcUrl?: string;
  chainId?: number;
}

export class CoinbaseConnector extends AbstractConnector<CoinbaseConnectionPayload> {
  constructor(private config: CoinbaseConnectorConfig) {
    super();
  }

  public async connect(): Promise<CoinbaseConnectionPayload> {
    const { jsonRpcUrl, chainId, ...ctorOptions } = this.config;

    const CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default;
    const coinbase = new CoinbaseWalletSDK(ctorOptions);

    const provider = coinbase.makeWeb3Provider(jsonRpcUrl, chainId);
    await provider.enable();

    this.payload = { provider, coinbase };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      this.payload.coinbase.disconnect();
    }
    super.disconnect();
  }

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    return super.subscribeDisconnect((error?: any) => {
      const isRecoverableDisconnection = error?.code === 1013;
      !isRecoverableDisconnection && callback(error);
    });
  }
}
