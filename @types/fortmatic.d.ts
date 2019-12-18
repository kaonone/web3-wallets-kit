/* eslint-disable */
declare module 'fortmatic' {
  import { Provider } from "web3/providers";

  export interface FortmaticProvider extends Provider {
    enable(): Promise<void>;
  }

  export interface User {
    login(): Promise<void>;
    logout(): void;
    getUser: unknown;
    getBalances: unknown;
    getTransactions: unknown;
    isLoggedIn: unknown;
    settings: unknown;
    deposit: unknown;
  }

  class Fortmatic {
    user: User;

    constructor(apiKey: string, network?: 'rinkeby' | 'kovan' | 'ropsten');

    getProvider(): FortmaticProvider;
  }

  export default Fortmatic;
}
