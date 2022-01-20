import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import {
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';

import { InpageProvider } from './@types/extend-window';

export { InpageProvider };

export interface InpageConnectionPayload extends DefaultConnectionPayload {
  provider: InpageProvider;
}

export class InpageConnector extends AbstractConnector<InpageConnectionPayload> {
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

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    return super.subscribeDisconnect((error?: any) => {
      const isRecoverableMetamaskDisconnection =
        this.payload?.provider?.isMetaMask && error?.code === 1013;
      !isRecoverableMetamaskDisconnection && callback(error);
    });
  }
}
