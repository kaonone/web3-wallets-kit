# Web3 Wallets Kit [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Данный пакет предназначен для подключения к Эфириум кошелькам, таким как Метамаск.

## Поддерживаемые кошельки:

- [x] [Metamask](https://metamask.io/)
- [x] [WalletConnect](https://walletconnect.org/)
- [x] [Bitsky](https://www.bitski.com/)
- [ ] [Portis](https://www.portis.io/)
- [ ] [Fortmatic](https://fortmatic.com/)
- [ ] [Squarelink](https://squarelink.com/)
- [ ] [Torus](https://tor.us/)
- [ ] [Ledger](https://www.ledger.com/)

## Установка

`npm install --save web3-wallets-kit`

## Создание и использование менеджера кошельков

```typescript
// Создаем инстанс
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

// Коннектимся к кошельку
await web3Manager.connect('metamask');

// забираем адрес и Web3 для отпарвки транзакций
const myAddress = web3Manager.account.value;
const txWeb3 = web3Manager.txWeb3.value;

// создаем контракт
const daiContract = txWeb3.eth.Contract(DAI_ABI, '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea');

// отправляем транзакцию
await daiContract.methods
  .transfer('0x0000000000000000000000000000000000000000', '1000000000000000000')
  .send({ from: myAddress });
```

## API менеджера кошельков

```typescript
class Web3WalletsManager {
    /** инстанс Web3 для чтения, нужно передать в конструктор одну из опций wsRpcUrl, httpRpcUrl или infuraAccessToken */
    web3: Web3;
    /** стрим с инстансом Web3 для отправки транзакций, инстанс создается после успешного коннекта с кошельком */
    txWeb3: BehaviorSubject<Web3 | null>;
    /** стрим с адресом текущего аккаунта из законнекченного кошелька */
    account: BehaviorSubject<string | null>;
    /** стрим с текущим подключенным кошельком */
    wallet: BehaviorSubject<WalletType | null>;
    /** стрим со статусом соединения */
    status: BehaviorSubject<ConnectionStatus>;

    constructor(options: Options);

    /** Запустить коннект к кошельку, в качестве результата вернет инстанс Web3 для отправки транзакций и адрес аккаунта */
    connect(wallet: WalletType): Promise<ConnectResult>;
    /** Отключиться от кошелька, обнуляет все стримы */
    disconnect(): Promise<void>;
}

interface Options {
    wsRpcUrl?: string;
    httpRpcUrl?: string;
    infuraAccessToken?: string;
    /** default: 'mainnet' */
    network?: InfuraNetwork;
    /** default: true. автоматически запускает коннект к последнему использованному кошельку */
    autoConnectToPreviousWallet?: boolean;
    /** дополнительные конфиги для подключения к кошелькам */
    walletConfigs: WalletConfigs;
}
```

## Инструкции по подключению к кошелькам

### Metamask

```typescript
await web3Manager.connect('metamask');
```

Не нуждается в дополнительной настройке. У юзера должно быть установлено браузерное расширение.

### ConnectWallet

```typescript
await web3Manager.connect('wallet-connect');
```

Для корректной работы при создании инстанса `Web3WalletsManager`, нужно передать конфиг [`Options['walletConfigs']['wallet-connect']`](https://github.com/akropolisio/web3-wallets-kit/blob/master/%40types/walletconnect/web3-provider.d.ts#L7-L23). Минимальный конфиг:

```typescript
{ infuraId: 'INFURA_TOKEN' }
```

### Bitski

```typescript
await web3Manager.connect('bitski');
```

Требуется конфиг [`Options['walletConfigs']['bitski']`](https://github.com/akropolisio/web3-wallets-kit/blob/master/src/Web3WalletsManager/types.ts#L66-L71). Минимальный конфиг:

```typescript
{
  clientId: 'CLIENT_ID',
  redirectUri: 'https://my-dapp-doma.in/bitski-callback.html',
}
```

Данный провайдер использует технологию OAuth, поэтому
- юзер должен быть зарегистрирован в [Bitski](https://www.bitski.com/users/)
- приложение должно быть зарегистрировано в [Bitski](https://www.bitski.com/developers/), в конфиге нужно указать `CLIENT_ID`, которое можно найти в [личном кабинете](https://developer.bitski.com/)
- DApp должно хостить [страничку для редиректа](./assets/bitski/bitski-callback.html). [Пример на webpack](./examples/bitski-callback-webpack.md).
- нужно произвести настройки редиректа в [личном кабинете](https://developer.bitski.com/) приложения, на страничке OAuth в список "Authorized Redirect URLs" нужно добавить урл для редиректа, который мы указали в конфиге.
