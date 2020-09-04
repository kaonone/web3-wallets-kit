# @web3-wallets-kit/wallet-link-connector

## Installation

`npm install @web3-wallets-kit/wallet-link-connector`

## Example

```typescript
import { WalletLinkConnector } from '@web3-wallets-kit/wallet-link-connector';

const ETH_JSONRPC_URL = `https://${NETWORK_NAME}.infura.io/v3/${INFURA_API_KEY}`;

const connector = new WalletLinkConnector({
    appName: 'MyApp',
    chainId: ETH_NETWORK_CONFIG.id,
    jsonRpcUrl: ETH_JSONRPC_URL,
});
```
