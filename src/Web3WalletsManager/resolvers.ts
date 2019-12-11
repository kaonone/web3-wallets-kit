import { Provider } from 'web3/providers';
import { Bitski } from 'bitski';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { Resolvers, MetamaskInpageProvider } from './types';

export const resolvers: Resolvers = {
  'wallet-connect': {
    async initialize(config) {
      const provider = new WalletConnectProvider(config);

      await provider.enable();

      return {
        wallet: 'wallet-connect' as const,
        provider,
        payload: provider,
      };
    },
    async destroy({ payload: provider }) {
      const walletConnector = await provider.getWalletConnector();
      await walletConnector.killSession();
      await provider.stop();
    },
  },
  metamask: {
    async initialize() {
      let provider: MetamaskInpageProvider;

      if (typeof window.ethereum !== 'undefined') {
        provider = window.ethereum;
      } else if (typeof window.web3 !== 'undefined') {
        provider = window.web3.currentProvider;
      } else {
        throw new Error(
          'No web3 provider found! Please install Metamask or use TrustWallet on mobile device.',
        );
      }

      if (provider.enable) {
        await provider.enable();
      }

      return {
        wallet: 'metamask' as const,
        provider,
      };
    },
    destroy() {},
  },
  bitski: {
    async initialize({ clientId, redirectUri, additionalScopes, options }) {
      const bitski = new Bitski(clientId, redirectUri, additionalScopes, options);
      const provider = (bitski.getProvider() as unknown) as Provider;

      await bitski.signIn();

      return {
        wallet: 'bitski' as const,
        provider,
        payload: bitski,
      };
    },
    async destroy({ payload: bitski }) {
      await bitski.signOut();
    },
  },
  // fortmatic: {
  //   initialize() {
  //     return {
  //       type: 'fortmatic',
  //       provider,
  //       payload: provider,
  //     };
  //   },
  //   destroy({ payload }) {},
  // },
  // ledger: {
  //   initialize() {
  //     return {
  //       type: 'ledger',
  //       provider,
  //       payload: provider,
  //     };
  //   },
  //   destroy({ payload }) {},
  // },
  // portis: {
  //   initialize() {
  //     return {
  //       type: 'portis',
  //       provider,
  //       payload: provider,
  //     };
  //   },
  //   destroy({ payload }) {},
  // },
  // squarelink: {
  //   initialize() {
  //     return {
  //       type: 'squarelink',
  //       provider,
  //       payload: provider,
  //     };
  //   },
  //   destroy({ payload }) {},
  // },
  // torus: {
  //   initialize() {
  //     return {
  //       type: 'torus',
  //       provider,
  //       payload: provider,
  //     };
  //   },
  //   destroy({ payload }) {},
  // },
};
