# @web3-wallets-kit/torus-connector

## Installation

`npm install @web3-wallets-kit/torus-connector`

## Example

```typescript
import { TorusConnector } from '@web3-wallets-kit/torus-connector';

const connector = new TorusConnector({
  initOptions: {
    network: {
      host: 'kovan',
      chainId: 42,
    },
    showTorusButton: false,
  },
});
```
