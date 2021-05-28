import { Provider } from '@web3-wallets-kit/types';

export type ConnectionStatus = 'disconnected' | 'pending' | 'connected';

export interface ConnectResult {
  provider: Provider;
  account: string;
  chainId: number;
}
