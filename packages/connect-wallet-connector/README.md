# @web3-wallets-kit/connect-wallet-connector

## Installation

`npm install @web3-wallets-kit/connect-wallet-connector`

## Example

```typescript
import { ConnectWalletConnector } from '@web3-wallets-kit/connect-wallet-connector';

const connector = new ConnectWalletConnector({
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [1], // Ethereum Mainnet
  showQrModal: true,
  metadata: {
    name: 'My App',
    description: 'My App Description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
  },
});
```

## Configuration

WalletConnect v2 requires a `projectId` that you can get from [WalletConnect Cloud](https://cloud.walletconnect.com).

### Required Parameters

- `projectId`: Your WalletConnect Cloud project ID
- `chains`: Array of chain IDs (e.g., `[1]` for Ethereum Mainnet, `[42]` for Kovan)

### Optional Parameters

- `showQrModal`: Show QR code modal (default: `true`)
- `optionalChains`: Array of optional chain IDs
- `rpcMap`: Custom RPC endpoints mapping (e.g., `{ 1: 'https://mainnet.infura.io/v3/YOUR_KEY' }`)
- `metadata`: App metadata (name, description, url, icons)
- `qrModalOptions`: QR modal customization (themeMode, themeVariables)
