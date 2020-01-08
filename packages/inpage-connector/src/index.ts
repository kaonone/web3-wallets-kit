import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import { getAccount } from '@web3-wallets-kit/utils';

import { InpageProvider } from './@types/extend-window';

export { InpageProvider };

export interface InpageConnectionPayload extends DefaultConnectionPayload {
  provider: InpageProvider;
}

export class InpageConnector implements Connector<InpageConnectionPayload> {
  private payload: InpageConnectionPayload | null = null;

  public async connect(): Promise<InpageConnectionPayload> {
    let provider: InpageProvider;

    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3?.currentProvider) {
      provider = window.web3.currentProvider;
    } else {
      throw new Error(
        'Web3 provider not found! Please install the Web3 extension (e.g. Metamask) or use the Web3 browser (e.g. TrustWallet on your mobile device).',
      );
    }

    if (provider.enable) {
      await provider.enable();
    }

    this.payload = {
      provider,
    };

    return this.payload;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  public async disconnect() {}

  public async getAccount(): Promise<string | null> {
    if (!this.payload) {
      return null;
    }
    return getAccount(this.payload.provider);
  }

  public getConnectionPayload() {
    return this.payload;
  }
}
