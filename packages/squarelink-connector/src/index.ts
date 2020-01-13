import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type SquarelinkClass = import('squarelink').default;
type SquarelinkOptions = import('squarelink').Options;
type Network = string | import('squarelink').Network;
type SquarelinkProvider = import('squarelink').SquarelinkProvider;

export interface SquarelinkConnectorConfig {
  apiKey: string;
  network?: string | Network;
  options?: SquarelinkOptions;
}

export interface SquarelinkConnectionPayload extends DefaultConnectionPayload {
  provider: SquarelinkProvider;
  squarelink: SquarelinkClass;
}

export class SquarelinkConnector extends AbstractConnector<SquarelinkConnectionPayload> {
  constructor(private config: SquarelinkConnectorConfig) {
    super();
  }

  public async connect(): Promise<SquarelinkConnectionPayload> {
    const { apiKey, network, options } = this.config;
    const SquarelinkLibrary = await import('squarelink');
    const Squarelink = SquarelinkLibrary.default;

    const squarelink = new Squarelink(apiKey, network, options);
    const provider: SquarelinkProvider = await squarelink.getProvider();

    await provider.enable();

    this.payload = {
      provider,
      squarelink,
    };

    return this.payload;
  }
}
