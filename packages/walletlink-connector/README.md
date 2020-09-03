# @web3-wallets-kit/walletlink-connector

## Installation

`npm install @web3-wallets-kit/walletlink-connector`

## Example

```typescript
import { ConnectWalletConnector } from '@web3-wallets-kit/walletlink-connector';

const ETH_JSONRPC_URL = `https://${NETWORK_NAME}.infura.io/v3/${INFURA_API_KEY}`;

const connector = new ConnectWalletConnector({
    appName: 'MyApp',
    chainId: ETH_NETWORK_CONFIG.id,
    jsonRpcUrl: ETH_JSONRPC_URL,
});
```
