/* eslint-disable import/no-default-export */
declare module '@walletconnect/web3-provider' {
  import { Provider } from 'web3/providers';

  export interface ProviderOptions {
    bridge: string;
    rpc: {};
    chainId?: 1 | 3 | 4 | 5 | 42;
  }

  type Account = string;

  class WalletConnectProvider extends Provider {
    constructor(options: ProviderOptions);
    getWalletConnector(): Promise<WalletConnector>;
    enable(): Promise<Account[]>;
    stop(): Promise<void>;
  }

  interface WalletConnector {
    killSession(): Promise<void>;
  }

  export default WalletConnectProvider;
}
