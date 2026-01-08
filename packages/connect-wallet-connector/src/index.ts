/* eslint-disable import/no-duplicates */
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';
import type EthereumProvider from '@walletconnect/ethereum-provider';
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider';

export type ConnectWalletConnectorConfig = EthereumProviderOptions;

export interface ConnectWalletConnectionPayload extends DefaultConnectionPayload {
  provider: EthereumProvider;
}

export class ConnectWalletConnector extends AbstractConnector<ConnectWalletConnectionPayload> {
  constructor(private config: ConnectWalletConnectorConfig) {
    super();
  }

  public async connect(): Promise<ConnectWalletConnectionPayload> {
    const { EthereumProvider: WalletConnectProvider } = await import(
      '@walletconnect/ethereum-provider'
    );

    const provider = await WalletConnectProvider.init(this.config);

    await provider.connect();

    this.payload = {
      provider,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      await this.payload.provider.disconnect();
    }
    super.disconnect();
  }
}
