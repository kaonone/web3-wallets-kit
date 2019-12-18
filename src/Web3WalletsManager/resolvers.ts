import { Provider } from 'web3/providers';
import { Bitski } from 'bitski';
import Fortmatic from 'fortmatic';
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
  fortmatic: {
    async initialize({ apiKey, network }) {
      const fm = new Fortmatic(apiKey, network);
      const provider = fm.getProvider();

      await provider.enable();

      return {
        wallet: 'fortmatic' as const,
        provider,
        payload: fm,
      };
    },
    destroy({ payload: fm }) {
      fm.user.logout();
    },
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
};
