/* eslint-disable import/no-duplicates */
import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import {
  ConnectCallback,
  DefaultConnectionPayload,
  DisconnectCallback,
  Provider,
  SubscribedObject,
} from '@web3-wallets-kit/types';
import type PortisClass from '@portis/web3';
import type { IOptions, INetwork } from '@portis/web3';

type PortisOptions = IOptions;
type Network = string | INetwork;

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

  public subscribeConnectAccount(callback: ConnectCallback): SubscribedObject {
    this.payload?.portis.onActiveWalletChanged(callback);

    return {
      unsubscribe: () => this.payload?.portis.onActiveWalletChanged(() => {}),
    };
  }

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    this.payload?.portis.onLogout(callback);

    return {
      unsubscribe: () => this.payload?.portis.onLogout(() => {}),
    };
  }
}
