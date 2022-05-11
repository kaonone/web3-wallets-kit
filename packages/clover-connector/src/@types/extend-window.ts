import { Provider } from '@web3-wallets-kit/types';

export type CloverProvider = Provider & {
  enable?(): Promise<void>;
  isClover?: boolean;
};

declare global {
  interface Window {
    ethereum?: unknown;
    clover?: unknown;
  }
}
