# @web3-wallets-kit/coinbase-connector

## Installation

`npm install @web3-wallets-kit/coinbase-connector`

## Example

```typescript
import { CoinbaseConnector } from '@web3-wallets-kit/coinbase-connector';

const ETH_JSONRPC_URL = `https://${NETWORK_NAME}.infura.io/v3/${INFURA_API_KEY}`;

const connector = new CoinbaseConnector({
    appName: 'MyApp',
    chainId: ETH_NETWORK_CONFIG.id,
    jsonRpcUrl: ETH_JSONRPC_URL,
});
```
