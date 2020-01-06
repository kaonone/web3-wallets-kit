import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import FortmaticClass, { FortmaticProvider } from 'fortmatic'; // use only for type definitions!

export interface FortmaticConnectorConfig {
  apiKey: string;
  network?: 'rinkeby' | 'kovan' | 'ropsten';
}

export interface FortmaticConnectionPayload extends DefaultConnectionPayload {
  provider: FortmaticProvider;
  fortmatic: FortmaticClass;
}

export class FortmaticConnector implements Connector<FortmaticConnectionPayload> {
  private payload: FortmaticConnectionPayload | null = null;

  constructor(private config: FortmaticConnectorConfig) {}

  public async connect(): Promise<FortmaticConnectionPayload> {
    const { apiKey, network } = this.config;
    const FortmaticLibrary = await import('fortmatic');
    const Fortmatic = FortmaticLibrary.default;
    const fortmatic = new Fortmatic(apiKey, network);
    const provider = fortmatic.getProvider();

    await provider.enable();

    this.payload = {
      provider,
      fortmatic,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      this.payload.fortmatic.user.logout();
    }
  }

  // TODO move to utils
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
