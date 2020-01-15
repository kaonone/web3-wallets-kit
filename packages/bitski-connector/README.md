# @web3-wallets-kit/bitski-connector

This provider uses OAuth

- user must be registered with [Bitski](https://www.bitski.com/users/)
- the application must be registered in [Bitski](https://www.bitski.com/developers/). In the config you need to specify `CLIENT_ID` which can be found in [your account](https://developer.bitski.com/)
- DApp must be hosting [the redirect page](./assets/bitski-callback.html). Here is [an example of webpack](#adding-a-bitski-redirect-page-to-a-webpack-build).
- you need to set redirect settings in [your personal account](https://developer.bitski.com/). On the OAuth page in the list of "Authorized Redirect URLs" you need to add the URL for the redirect, which we specified in the config.

## Installation

`npm install @web3-wallets-kit/bitski-connector`

## Example

```typescript
import { BitskiConnector } from '@web3-wallets-kit/bitski-connector';

const connector = new BitskiConnector({
  clientId: 'BITSKI_API_KEY',
  redirectUri: 'https://your-domain.asd/bitski-callback.html',
});
```

## Adding a Bitski redirect page to a webpack build

```typescript
import FileManagerWebpackPlugin from 'filemanager-webpack-plugin';

// add to config.plugins
new FileManagerWebpackPlugin({
  onEnd: {
    copy: [
      {
        source: `node_modules/@web3-wallets-kit/bitski-connector/assets/bitski-callback.html`,
        destination: `build/bitski-callback.html`,
      },
    ],
  },
})
```
