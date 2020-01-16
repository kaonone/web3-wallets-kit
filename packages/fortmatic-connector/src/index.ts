import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type FortmaticClass = import('fortmatic').default;
type FortmaticProvider = import('fortmatic').FortmaticProvider;

export interface FortmaticConnectorConfig {
  apiKey: string;
  network?: 'rinkeby' | 'kovan' | 'ropsten' | 'mainnet';
}

export interface FortmaticConnectionPayload extends DefaultConnectionPayload {
  provider: FortmaticProvider;
  fortmatic: FortmaticClass;
}

export class FortmaticConnector extends AbstractConnector<FortmaticConnectionPayload> {
  constructor(private config: FortmaticConnectorConfig) {
    super();
  }

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
    super.disconnect();
  }
}
