import { Provider } from '@web3-wallets-kit/types';

export type InpageProvider = Provider & {
  enable?(): Promise<void>;
};

declare global {
  interface Window {
    web3?: {
      currentProvider?: InpageProvider;
    };
    ethereum?: InpageProvider;
  }
}
