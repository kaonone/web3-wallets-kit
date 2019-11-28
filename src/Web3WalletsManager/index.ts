import Web3 from 'web3';
import { O } from 'ts-toolbelt';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { autobind } from 'core-decorators';

import {
  WalletType,
  ConnectResult,
  ConnectionDetailsUnion,
  WalletConfigs,
  Resolver,
  ConnectionDetails,
  ConnectionStatus,
} from './types';
import { resolvers } from './resolvers';
import { LocalStorage } from './storage';

export * from './types';

type InfuraNetwork = 'rinkeby' | 'kovan' | 'mainnet' | 'ropsten' | 'goerli';

interface Options {
  httpRpcUrl?: string;
  wsRpcUrl?: string;
  infuraAccessToken?: string;
  /** default: 'mainnet' */
  network?: InfuraNetwork;
  /** default: true */
  autoConnectToPreviousWallet?: boolean;
  walletConfigs: WalletConfigs;
}

type DefaultOptionKey = 'network' | 'autoConnectToPreviousWallet';
type InternalOptions = O.Required<Options, DefaultOptionKey>;

const defaultOptions: Required<Pick<Options, DefaultOptionKey>> = {
  network: 'mainnet',
  autoConnectToPreviousWallet: true,
};

export class Web3WalletsManager {
  public web3: Web3;
  public txWeb3 = new BehaviorSubject<Web3 | null>(null);
  // public gsnWeb3 = new BehaviorSubject<Web3 | null>(null);
  public account = new BehaviorSubject<string | null>(null);
  public wallet = new BehaviorSubject<WalletType | null>(null);
  public status = new BehaviorSubject<ConnectionStatus>('disconnected');

  private storage = new LocalStorage();
  private options: InternalOptions;
  private connectionDetails: ConnectionDetailsUnion | null = null;
  private accountSubscription: Subscription | null = null;

  constructor(options: Options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.checkOptions();
    this.web3 = this.getWeb3();

    const connectedWallet = this.storage.get('__web3wm_connectedWallet__');
    this.options.autoConnectToPreviousWallet && connectedWallet && this.connect(connectedWallet);
  }

  @autobind
  public async connect(wallet: WalletType): Promise<ConnectResult> {
    await this.disconnect();

    try {
      this.status.next('pending');

      const resolver = resolvers[wallet] as Resolver<'wallet-connect'>;
      const config = this.options.walletConfigs[wallet as 'wallet-connect'];

      const connectionDetails = await resolver.initialize(config);

      const web3 = new Web3(connectionDetails.provider);
      const account = await getAccount(web3);

      this.storage.set('__web3wm_connectedWallet__', connectionDetails.wallet);
      this.wallet.next(connectionDetails.wallet);
      this.connectionDetails = connectionDetails;

      this.txWeb3.next(web3);
      this.account.next(account);
      this.accountSubscription = interval(1000)
        .pipe(switchMap(() => getAccount(web3)))
        .subscribe(this.account);

      this.status.next('connected');

      return { web3, account };
    } catch (error) {
      this.resetState();
      throw error;
    }
  }

  @autobind
  public async disconnect() {
    try {
      this.accountSubscription && this.accountSubscription.unsubscribe();

      if (this.connectionDetails) {
        const resolver = resolvers[this.connectionDetails.wallet as 'wallet-connect'];
        await resolver.destroy(this.connectionDetails as ConnectionDetails<'wallet-connect'>);
      }
    } finally {
      this.resetState();
    }
  }

  public async getAccount(): Promise<string> {
    const web3 = this.txWeb3.getValue();
    if (!web3) {
      throw new Error(
        'Web3 instance is not found, you need to connect wallet before account getting',
      );
    }
    return getAccount(web3);
  }

  private resetState() {
    this.connectionDetails = null;
    this.txWeb3.next(null);
    this.account.next(null);
    this.wallet.next(null);
    this.status.next('disconnected');
    this.storage.remove('__web3wm_connectedWallet__');
  }

  private checkOptions() {
    const { httpRpcUrl, wsRpcUrl, infuraAccessToken } = this.options;

    if (!httpRpcUrl && !wsRpcUrl && !infuraAccessToken) {
      console.error(
        'You need to configure one of these parameters: "httpRpcUrl", "wsRpcUrl" or "infuraAccessToken".',
      );
    }
  }

  private getWeb3() {
    const { httpRpcUrl, wsRpcUrl, infuraAccessToken } = this.options;

    const network: InfuraNetwork = this.options.network || 'mainnet';

    const provider =
      (wsRpcUrl && new Web3.providers.WebsocketProvider(wsRpcUrl)) ||
      (httpRpcUrl && new Web3.providers.HttpProvider(httpRpcUrl)) ||
      new Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws/v3/${infuraAccessToken}`);

    return new Web3(provider);
  }
}

async function getAccount(web3: Web3) {
  const accounts = await web3.eth.getAccounts();
  if (!accounts[0]) {
    throw new Error('No Ethereum accounts found, you need to create an account in your wallet');
  }
  return accounts[0];
}
