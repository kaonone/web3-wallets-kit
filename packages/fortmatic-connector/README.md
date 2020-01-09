# @web3-wallets-kit/fortmatic-connector

You need to create API_KEY. You can do it in [Fortmatic dashboard](https://dashboard.fortmatic.com/).

## Installation

`npm install @web3-wallets-kit/fortmatic-connector`

## Example

```typescript
import { FortmaticConnector } from '@web3-wallets-kit/fortmatic-connector';

const connector = new FortmaticConnector({
  apiKey: 'API_KEY or TEST_API_KEY',
  network: 'kovan',
});
```
