import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';

import { InpageProvider } from './@types/extend-window';

export { InpageProvider };

export interface InpageConnectionPayload extends DefaultConnectionPayload {
  provider: InpageProvider;
}

export class BitskiConnector implements Connector<InpageConnectionPayload> {
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
    try {
      return await new Promise((resolve, reject) => {
        if (!this.payload) {
          resolve(null);
          return;
        }

        this.payload.provider.send('eth_accounts', (err, sendResult) => {
          err && reject(err);

          const account = sendResult?.result?.[0];
          account ? resolve(account) : resolve(null);
        });
      });
    } catch {
      return null;
    }
  }

  public getConnectionPayload() {
    return this.payload;
  }
}
