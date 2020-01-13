import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload, Provider } from '@web3-wallets-kit/types';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type PortisClass = import('@portis/web3').default;
type PortisOptions = import('@portis/web3').IOptions;
type Network = string | import('@portis/web3').INetwork;

export type PortisProvider = Provider & {
  enable(): Promise<void>;
};

export interface PortisConnectorConfig {
  apiKey: string;
  network: Network;
  options?: PortisOptions;
}

export interface PortisConnectionPayload extends DefaultConnectionPayload {
  provider: PortisProvider;
  portis: PortisClass;
}

export class PortisConnector extends AbstractConnector<PortisConnectionPayload> {
  constructor(private config: PortisConnectorConfig) {
    super();
  }

  public async connect(): Promise<PortisConnectionPayload> {
    const { apiKey, network, options } = this.config;
    const PortisLibrary = await import('@portis/web3');
    const Portis = PortisLibrary.default;
    const portis = new Portis(apiKey, network, options);
    // eslint-disable-next-line prefer-destructuring
    const provider: PortisProvider = portis.provider;

    await provider.enable();

    this.payload = {
      provider,
      portis,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      this.payload.portis.logout();
    }
    super.disconnect();
  }
}
