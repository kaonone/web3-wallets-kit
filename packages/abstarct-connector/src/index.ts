import {
  ChainIdCallback,
  ConnectCallback,
  Connector,
  DefaultConnectionPayload,
  DisconnectCallback,
  SubscribedObject,
} from '@web3-wallets-kit/types';
import { getAccount, getChainId, SendingInterface } from '@web3-wallets-kit/utils';

export abstract class AbstractConnector<P extends DefaultConnectionPayload>
  implements Connector<P> {
  protected payload: P | null = null;
  private sendingInterface: SendingInterface = 'EIP 1193';

  public abstract connect(): Promise<P>;

  public async disconnect() {
    this.payload = null;
  }

  public async getAccount(): Promise<string | null> {
    if (!this.payload) {
      return null;
    }

    const { account, sendingInterface } = await getAccount(
      this.payload.provider,
      this.sendingInterface,
    );

    this.sendingInterface = sendingInterface;

    return account;
  }

  public async getChainId(): Promise<number | null> {
    if (!this.payload) {
      return null;
    }

    const { chainId, sendingInterface } = await getChainId(
      this.payload.provider,
      this.sendingInterface,
    );

    this.sendingInterface = sendingInterface;

    return chainId;
  }

  public getConnectionPayload() {
    return this.payload;
  }

  public subscribeConnectAccount(callback: ConnectCallback): SubscribedObject {
    const convertedCallback = (accounts: string[]) => callback(accounts[0]);

    this.payload?.provider.on && this.payload.provider.on('accountsChanged', convertedCallback);

    return {
      unsubscribe: () => {
        this.payload?.provider.removeListener &&
          this.payload.provider.removeListener('accountsChanged', convertedCallback);
      },
    };
  }

  public subscribeChainId(callback: ChainIdCallback): SubscribedObject {
    const convertedCallback = (chainId: number | string) => {
      const convertedChainId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;

      if (Number.isNaN(convertedChainId)) {
        throw new Error('ChainId is incorrect');
      } else {
        callback(convertedChainId);
      }
    };

    this.payload?.provider.on && this.payload.provider.on('chainChanged', convertedCallback);

    return {
      unsubscribe: () => {
        this.payload?.provider.removeListener &&
          this.payload.provider.removeListener('chainChanged', convertedCallback);
      },
    };
  }

  public subscribeDisconnect(callback: DisconnectCallback): SubscribedObject {
    this.payload?.provider.on && this.payload.provider.on('disconnect', callback);

    return {
      unsubscribe: () => {
        this.payload?.provider.removeListener &&
          this.payload.provider.removeListener('disconnect', callback);
      },
    };
  }
}
