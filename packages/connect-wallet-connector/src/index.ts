import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/types';

// TODO rewrite to Type-Only export with typescript@3.8
// https://github.com/microsoft/TypeScript/pull/35200
type WalletConnectProvider = import('@walletconnect/web3-provider').default;
type ConnectWalletConnectorConfig = import('@walletconnect/web3-provider').ProviderOptions;

export { ConnectWalletConnectorConfig };

export interface ConnectWalletConnectionPayload extends DefaultConnectionPayload {
  provider: WalletConnectProvider;
}

export class ConnectWalletConnector extends AbstractConnector<ConnectWalletConnectionPayload> {
  constructor(private config: ConnectWalletConnectorConfig) {
    super();
  }

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
    super.disconnect();
  }
}
