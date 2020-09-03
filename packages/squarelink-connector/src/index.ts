/* eslint-disable import/no-duplicates */
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';
import type SquarelinkClass from 'squarelink';
import type { Options as SquarelinkOptions, Network, SquarelinkProvider } from 'squarelink';

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
