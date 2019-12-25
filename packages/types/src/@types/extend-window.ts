/* eslint-disable import/no-extraneous-dependencies */
import Web3 from 'web3';
import { Provider } from 'web3/providers';

declare global {
  interface Window {
    web3?: Web3;
    ethereum?: Provider & {
      enable(): Promise<void>;
    };
  }
}
