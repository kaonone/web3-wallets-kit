import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import WalletConnectProvider, {
  ProviderOptions as ConnectWalletConnectorConfig,
} from '@walletconnect/web3-provider'; // use only for type definitions!

export { ConnectWalletConnectorConfig };

export interface ConnectWalletConnectionPayload extends DefaultConnectionPayload {
  provider: WalletConnectProvider;
}

export class BitskiConnector implements Connector<ConnectWalletConnectionPayload> {
  private payload: ConnectWalletConnectionPayload | null = null;

  constructor(private config: ConnectWalletConnectorConfig) {}

  public async connect(): Promise<ConnectWalletConnectionPayload> {
    const WalletConnectLibrary = await import('@walletconnect/web3-provider');
    const Provider = WalletConnectLibrary.default;
    const provider = new Provider(this.config);

    await provider.enable();

    this.payload = {
      provider,
    };

    return this.payload;
  }

  public async disconnect() {
    if (this.payload) {
      const walletConnector = await this.payload.provider.getWalletConnector();
      await walletConnector.killSession();
      await this.payload.provider.stop();
    }
  }

  // TODO move to utils
  public async getAccount(): Promise<string | null> {
    try {
      return await new Promise((resolve, reject) => {
        if (!this.payload) {
          resolve(null);
          return;
        }

        this.payload.provider.send('eth_accounts', (err, sendResult) => {
          err && reject(err);

          const account = sendResult?.result?.[0];
          account ? resolve(account) : resolve(null);
        });
      });
    } catch {
      return null;
    }
  }

  public getConnectionPayload() {
    return this.payload;
  }
}
