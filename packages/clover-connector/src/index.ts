import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import type { CloverConnector as CloverClass } from '@clover-network/clover-connector';
import {
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';

type CloverConnectorConfig = ConstructorParameters<typeof CloverClass>[0];
export interface CloverConnectionPayload extends DefaultConnectionPayload {
  clover: CloverClass;
}

export class CloverConnector extends AbstractConnector<CloverConnectionPayload> {
  constructor(private config: CloverConnectorConfig) {
    super();
  }

  public async connect(): Promise<CloverConnectionPayload> {
    const CloverConnectorLibrary = await import('@clover-network/clover-connector');
    const clover = new CloverConnectorLibrary.CloverConnector(this.config);
    const { provider } = await clover.activate();

    this.payload = {
      provider,
      clover,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      this.payload.clover.deactivate();
    }
    super.disconnect();
  }

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    return super.subscribeDisconnect((error?: any) => {
      const isRecoverableCloverDisconnection =
        this.payload?.provider?.isClover && error?.code === 1013;
      !isRecoverableCloverDisconnection && callback(error);
    });
  }
}
