/* eslint-disable import/no-default-export */
declare module '@walletconnect/web3-provider' {
  import { Provider } from 'web3/providers';

  type ChainId = 1 | 3 | 4 | 5 | 42;

  export interface ProviderOptions {
    /** default: 'https://bridge.walletconnect.org' */
    bridge?: string;
    /** default: 4000 */
    pollingInterval?: number;
    rpc?: Partial<Record<ChainId, string>>;
    infuraId: string;
    /** default: 1
     *
     * 1: 'mainnet'
     * 3: 'ropsten'
     * 4: 'rinkeby'
     * 5: 'goerli'
     * 42: 'kovan'
     */
    chainId?: ChainId;
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
