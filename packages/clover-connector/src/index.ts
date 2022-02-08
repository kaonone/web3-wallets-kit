import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import {
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';

import { CloverProvider } from './@types/extend-window';

export interface CloverConnectionPayload extends DefaultConnectionPayload {
  provider: CloverProvider;
}
export class CloverConnector extends AbstractConnector<CloverConnectionPayload> {
  public async connect(): Promise<CloverConnectionPayload> {
    const provider = window.clover || window.ethereum;

    if (!provider?.isClover) {
      throw new Error(
        'Clover provider not found! Please install the Clover extension or use the Clover mobile app.',
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

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    return super.subscribeDisconnect((error?: any) => {
      const isRecoverableCloverDisconnection =
        this.payload?.provider?.isClover && error?.code === 1013;
      !isRecoverableCloverDisconnection && callback(error);
    });
  }
}
