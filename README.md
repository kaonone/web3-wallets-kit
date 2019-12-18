# Web3 Wallets Kit [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This package is for connecting to Ethereum wallets, for example, to Metamask.

## Supported wallets:

- [x] [Metamask](https://metamask.io/)
- [x] [WalletConnect](https://walletconnect.org/)
- [x] [Bitsky](https://www.bitski.com/)
- [ ] [Portis](https://www.portis.io/)
- [ ] [Fortmatic](https://fortmatic.com/)
- [ ] [Squarelink](https://squarelink.com/)
- [ ] [Torus](https://tor.us/)
- [ ] [Ledger](https://www.ledger.com/)

## Installation

`npm install --save web3-wallets-kit`

## Creation and managing wallets

```typescript
// Create instance
const web3Manager = new Web3WalletsManager({
  network: 'kovan',
  infuraAccessToken: 'INFURA_TOKEN',
  walletConfigs: {
    'wallet-connect': {
      infuraId: 'INFURA_TOKEN',
      chainId: 42,
    },
    bitski: {
      clientId: 'CLIENT_ID',
      redirectUri: 'http://localhost:8080/bitski-callback.html',
    },
  },
});

// Connect to wallet
await web3Manager.connect('metamask');

// Get address and Web3 for sending transaction
const myAddress = web3Manager.account.value;
const txWeb3 = web3Manager.txWeb3.value;

// Create contract
const daiContract = txWeb3.eth.Contract(DAI_ABI, '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea');

// Send transaction
await daiContract.methods
  .transfer('0x0000000000000000000000000000000000000000', '1000000000000000000')
  .send({ from: myAddress });
```

## wallets manager API

```typescript
class Web3WalletsManager {
    /** Web3 instance for reading; constructor option should be wsRpcUrl, httpRpcUrl or infuraAccessToken */
    web3: Web3;
    /** Web3 instance for sending transactions. Instance is created after connecting with wallet */
    txWeb3: BehaviorSubject<Web3 | null>;
    /** active account address */
    account: BehaviorSubject<string | null>;
    /** current connected wallet’s */
    wallet: BehaviorSubject<WalletType | null>;
    /** status of the connection */
    status: BehaviorSubject<ConnectionStatus>;

    constructor(options: Options);

    /** Connect to wallet; Returns account address and Web3 Instance for sending transactions */
    connect(wallet: WalletType): Promise<ConnectResult>;
    /** Disconnect wallet, close streams */
    disconnect(): Promise<void>;
}

interface Options {
    wsRpcUrl?: string;
    httpRpcUrl?: string;
    infuraAccessToken?: string;
    /** @default: 'mainnet' */
    network?: InfuraNetwork;
    /** It automatically connects to last used wallet
     * @default: true
     */
    autoConnectToPreviousWallet?: boolean;
    /** additional options for connecting to wallets */
    walletConfigs: WalletConfigs;
}
```

## Connecting to wallet guide

### Metamask

```typescript
await web3Manager.connect('metamask');
```

It does not need additional configuration. The user must have a browser extension installed.

### ConnectWallet

```typescript
await web3Manager.connect('wallet-connect');
```

You need to pass the config [`Options['walletConfigs']['wallet-connect']`](./%40types/walletconnect/web3-provider.d.ts#L7-L23) when creating instance `Web3WalletsManager`. Minimal config:

```typescript
{ infuraId: 'INFURA_TOKEN' }
```

### Fortmatic

```typescript
await web3Manager.connect('fortmatic');
```

You need to pass the config [`Options['walletConfigs']['fortmatic']`](./src/Web3WalletsManager/types.ts#L74-L77) when creating instance `Web3WalletsManager`. Minimal config:

```typescript
{
  apiKey: 'API_KEY or TEST_API_KEY',
}
```

You can create API_KEY in [Fortmatic dashboard](https://dashboard.fortmatic.com/).

### Bitski

```typescript
await web3Manager.connect('bitski');
```

You need to pass the config [`Options['walletConfigs']['bitski']`](./src/Web3WalletsManager/types.ts#L67-L72) when creating instance `Web3WalletsManager`. Minimal config:

```typescript
{
  clientId: 'CLIENT_ID',
  redirectUri: 'https://my-dapp-doma.in/bitski-callback.html',
}
```

This provider uses OAuth

- user must be registered with [Bitski](https://www.bitski.com/users/)
- the application must be registered in [Bitski](https://www.bitski.com/developers/). In the config you need to specify `CLIENT_ID` which can be found in [your account](https://developer.bitski.com/)
- DApp must host [the redirect page](./assets/bitski/bitski-callback.html). [An example on webpack](./examples/bitski-callback-webpack.md).
- you need to set redirect settings in [your personal account](https://developer.bitski.com/). On the OAuth page in the list of "Authorized Redirect URLs" you need to add the URL for the redirect, which we specified in the config.
