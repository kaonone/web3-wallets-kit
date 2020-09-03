import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload, Provider } from '@web3-wallets-kit/types';
import type { WalletLinkOptions } from 'walletlink/dist/WalletLink';

export type WalletLinkConfig = WalletLinkOptions & { jsonRpcUrl: string; chainId?: number };
type WalletLinkProvider = Provider & { enable(): Promise<any[]>; close: () => void };

export interface ConnectWalletConnectionPayload extends DefaultConnectionPayload {
  provider: WalletLinkProvider;
}

export class WalletlinkConnector extends AbstractConnector<ConnectWalletConnectionPayload> {
  constructor(private config: WalletLinkConfig) {
    super();
  }

  public async connect(): Promise<ConnectWalletConnectionPayload> {
    const { jsonRpcUrl, chainId, ...rest } = this.config;
    const WalletlinkLibrary = await import('walletlink');
    const WL = WalletlinkLibrary.default;
    const walletlink = new WL(rest);
    const provider = walletlink.makeWeb3Provider(jsonRpcUrl, chainId) as WalletLinkProvider;

    await provider.enable();

    this.payload = {
      provider,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      await this.payload.provider.close();
    }
    super.disconnect();
  }
}
