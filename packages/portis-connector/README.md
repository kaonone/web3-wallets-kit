# @web3-wallets-kit/portis-connector

You need to create API_KEY. You can do it in [Portis dashboard](https://dashboard.portis.io/).

## Installation

`npm install @web3-wallets-kit/portis-connector`

## Example

```typescript
import { PortisConnector } from '@web3-wallets-kit/portis-connector';

const connector = new PortisConnector({
  apiKey: 'API_KEY',
  network: 'kovan',
});
```
