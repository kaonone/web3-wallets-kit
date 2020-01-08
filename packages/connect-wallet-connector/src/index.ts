import { Connector, DefaultConnectionPayload } from '@web3-wallets-kit/types';
import { getAccount } from '@web3-wallets-kit/utils';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type WalletConnectProvider = import('@walletconnect/web3-provider').default;
type ConnectWalletConnectorConfig = import('@walletconnect/web3-provider').ProviderOptions;

export { ConnectWalletConnectorConfig };

export interface ConnectWalletConnectionPayload extends DefaultConnectionPayload {
  provider: WalletConnectProvider;
}

export class ConnectWalletConnector implements Connector<ConnectWalletConnectionPayload> {
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

  public async getAccount(): Promise<string | null> {
    if (!this.payload) {
      return null;
    }
    return getAccount(this.payload.provider);
  }

  public getConnectionPayload() {
    return this.payload;
  }
}
