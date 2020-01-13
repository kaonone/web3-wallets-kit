# @web3-wallets-kit/squarelink-connector

You need to create API_KEY. You can do it in [Squarelink dashboard](https://dev.squarelink.com/).

## Installation

`npm install @web3-wallets-kit/squarelink-connector`

## Example

```typescript
import { SquarelinkConnector } from '@web3-wallets-kit/squarelink-connector';

const connector = new SquarelinkConnector({
  apiKey: 'API_KEY',
  network: 'kovan',
});
```
