import { Provider } from 'web3/providers';
import { Bitski } from 'bitski';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { Resolvers } from './types';

export const resolvers: Resolvers = {
  'wallet-connect': {
    async initialize() {
      const provider = new WalletConnectProvider({
        bridge: 'https://bridge.walletconnect.org',
        rpc: {},
      });

      await provider.enable();

      return {
        type: 'wallet-connect' as const,
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
    initialize() {
      let provider: Provider;

      if (typeof window.ethereum !== 'undefined') {
        provider = window.ethereum;
      } else if (typeof window.web3 !== 'undefined') {
        provider = window.web3.currentProvider;
      } else {
        throw new Error(
          'No web3 provider found! Please install Metamask or use TrustWallet on mobile device.',
        );
      }

      return {
        type: 'metamask',
        provider,
        payload: undefined,
      };
    },
    destroy() {},
  },
  bitski: {
    async initialize() {
      const bitski = new Bitski(
        '', // api key
        'http://localhost:8080/bitski-callback.html',
      );
      const provider = (bitski.getProvider() as unknown) as Provider;

      await bitski.signIn();

      return {
        type: 'bitski' as const,
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
