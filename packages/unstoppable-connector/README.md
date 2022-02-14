# @web3-wallets-kit/unstoppable-connector

This provider uses OAuth

- users must have a domain minted on Ethereum Mainnet
- the application must be registered in [Unstoppable Domains](https://unstoppabledomains.com/app-submission)
- to get `UnstoppableConnector` configuration parameters you need to set redirect settings in [your personal account](https://unstoppabledomains.com/app-dashboard) and generate ClientID and Secret

## Installation

`npm install @web3-wallets-kit/unstoppable-connector`

## Example

```typescript
import { ConnectWalletConnector } from '@web3-wallets-kit/connect-wallet-connector';
import { InpageConnector } from '@web3-wallets-kit/inpage-connector';
import { UnstoppableConnector } from '@web3-wallets-kit/unstoppable-connector';

const connector = new UnstoppableConnector({
  clientOptions: {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URL,
  },
  connectors: {
    web3: new InpageConnector(),
    walletconnect: new ConnectWalletConnector({
      chainId: 1,
      rpc: {
        1: 'https://mainnet.mycustomnode.com',
      },
    }),
  },
});
```