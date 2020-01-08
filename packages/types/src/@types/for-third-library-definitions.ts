declare module '@web3-wallets-kit/for-third-library-definitions' {
  export interface JsonRpcPayload {
    jsonrpc?: string;
    method: string;
    params?: any[];
    id?: string | number;
  }

  export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
  }

  interface Send extends SendOld {
    // EIP 1193 https://eips.ethereum.org/EIPS/eip-1193
    (method: string, args?: any[]): Promise<any>;
  }

  interface SendOld {
    // Old Web3.js interface
    (
      payload: JsonRpcPayload,
      callback: (error: Error | null, result?: JsonRpcResponse) => void,
    ): void;
  }

  export class Provider {
    send: Send;
    sendAsync?: SendOld;
  }
}
