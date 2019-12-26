import { Provider } from '@web3-wallets-kit/for-third-library-definitions';

type InpageProvider = Provider & {
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
