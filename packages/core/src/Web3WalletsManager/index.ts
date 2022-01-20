import { BehaviorSubject } from 'rxjs';
import * as Web3ProvidersWs from 'web3-providers-ws';
import * as Web3ProvidersHttp from 'web3-providers-http';
import { Connector, Provider, SubscribedObject } from '@web3-wallets-kit/types';

import { ConnectResult, ConnectionStatus } from './types';

export * from './types';

const WebsocketProvider = (Web3ProvidersWs as unknown) as typeof Web3ProvidersWs.WebsocketProvider;
const HttpProvider = (Web3ProvidersHttp as unknown) as typeof Web3ProvidersHttp.HttpProvider;

type WebsocketProviderOptions = ConstructorParameters<typeof WebsocketProvider>[1];
type HttpProviderOptions = ConstructorParameters<typeof HttpProvider>[1];

type InfuraNetwork = 'rinkeby' | 'kovan' | 'mainnet' | 'ropsten' | 'goerli';

interface Options<W> {
  defaultProvider: OptionsOfDefaultProvider;
  makeWeb3(provider: Provider): W;
}

type OptionsOfDefaultProvider =
  | {
      httpRpcUrl: string;
      options?: HttpProviderOptions;
    }
  | {
      wsRpcUrl: string;
      options?: WebsocketProviderOptions;
    }
  | {
      infuraAccessToken: string;
      /** default: 'mainnet' */
      network?: InfuraNetwork;
      options?: WebsocketProviderOptions;
    };

export class Web3WalletsManager<W> {
  public web3: W;
  public txWeb3 = new BehaviorSubject<W | null>(null);
  public account = new BehaviorSubject<string | null>(null);
  public chainId = new BehaviorSubject<number | null>(null);
  public status = new BehaviorSubject<ConnectionStatus>('disconnected');

  private options: Options<W>;
  private activeConnector: Connector | null = null;
  private accountSubscription: SubscribedObject | null = null;
  private chainIdSubscription: SubscribedObject | null = null;
  private disconnectSubscription: SubscribedObject | null = null;

  constructor(options: Options<W>) {
    this.options = {
      ...options,
      defaultProvider: {
        network: 'mainnet',
        ...options.defaultProvider,
      },
    };
    this.checkOptions();
    this.web3 = options.makeWeb3(this.getDefaultProvider());

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);

    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleChainIdChange = this.handleChainIdChange.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  public async connect(connector: Connector): Promise<ConnectResult> {
    await this.disconnect();

    this.activeConnector = connector;
    const { makeWeb3 } = this.options;

    try {
      this.status.next('pending');

      const { provider } = await connector.connect();

      const web3 = makeWeb3(provider);
      this.txWeb3.next(web3);

      const account = await getAccount(connector);
      this.account.next(account);

      const chainId = await getChainId(connector);
      this.chainId.next(chainId);

      this.accountSubscription = connector.subscribeConnectAccount(this.handleAccountChange);
      this.chainIdSubscription = connector.subscribeChainId(this.handleChainIdChange);
      this.disconnectSubscription = connector.subscribeDisconnect(this.handleDisconnect);

      this.status.next('connected');

      return { provider, account, chainId };
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }

  public async disconnect() {
    try {
      this.accountSubscription && this.accountSubscription.unsubscribe();
      this.chainIdSubscription && this.chainIdSubscription.unsubscribe();
      this.disconnectSubscription && this.disconnectSubscription.unsubscribe();
      this.activeConnector && (await this.activeConnector.disconnect());
    } finally {
      this.resetState();
    }
  }

  private resetState() {
    this.activeConnector = null;
    this.accountSubscription = null;
    this.chainIdSubscription = null;
    this.disconnectSubscription = null;

    this.txWeb3.next(null);
    this.account.next(null);
    this.chainId.next(null);
    this.status.next('disconnected');
  }

  private checkOptions() {
    if (
      !('httpRpcUrl' in this.options.defaultProvider) &&
      !('wsRpcUrl' in this.options.defaultProvider) &&
      !('infuraAccessToken' in this.options.defaultProvider)
    ) {
      console.error(
        'You need to configure one of these parameters: "httpRpcUrl", "wsRpcUrl" or "infuraAccessToken".',
      );
    }
  }

  private getDefaultProvider(): Web3ProvidersWs.WebsocketProvider | Web3ProvidersHttp.HttpProvider {
    if ('httpRpcUrl' in this.options.defaultProvider) {
      const { httpRpcUrl, options } = this.options.defaultProvider;
      return new HttpProvider(httpRpcUrl, options);
    }

    const defaultReconnectOptions = {
      auto: true,
      delay: 5000,
    };

    if ('wsRpcUrl' in this.options.defaultProvider) {
      const { wsRpcUrl, options } = this.options.defaultProvider;
      return new WebsocketProvider(wsRpcUrl, {
        ...options,
        reconnect: {
          ...defaultReconnectOptions,
          ...options?.reconnect,
        },
      });
    }

    if ('infuraAccessToken' in this.options.defaultProvider) {
      const { infuraAccessToken, network = 'mainnet', options } = this.options.defaultProvider;
      return new WebsocketProvider(`wss://${network}.infura.io/ws/v3/${infuraAccessToken}`, {
        ...options,
        reconnect: {
          ...defaultReconnectOptions,
          ...options?.reconnect,
        },
      });
    }

    return assertNever(this.options.defaultProvider);
  }

  private handleAccountChange(account: string) {
    this.account.next(account);
  }

  private handleChainIdChange(chainId: number) {
    this.chainId.next(chainId);
  }

  private handleDisconnect() {
    this.disconnect();
  }
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

async function getAccount(connector: Connector): Promise<string> {
  const account = await connector.getAccount();

  if (!account) {
    throw new Error('No Ethereum accounts found, you need to create an account in your wallet');
  }

  return account;
}

async function getChainId(connector: Connector): Promise<number> {
  const chainId = await connector.getChainId();

  if (!chainId) {
    throw new Error('ChainID is not found, you need to choose a network in your wallet');
  }

  return chainId;
}
