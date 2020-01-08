import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import { getAccount } from '@web3-wallets-kit/utils';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type FortmaticClass = import('fortmatic').default;
type FortmaticProvider = import('fortmatic').FortmaticProvider;

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
