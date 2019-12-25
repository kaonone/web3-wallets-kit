import { PayloadByKey, StorageKey } from './types';

function checkLSAvailability() {
  const testKey = '__web3wm_test__';

  try {
    localStorage.setItem(testKey, '__web3wm_test-value__');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

class LocalStorage {
  private isLocalStorageAvailable: boolean | null = null;

  constructor() {
    this.isLocalStorageAvailable = checkLSAvailability();
  }

  public set<T extends StorageKey>(key: T, value: PayloadByKey[T]): void {
    this.isLocalStorageAvailable && localStorage.setItem(key, JSON.stringify(value));
  }

  public get<T extends StorageKey>(key: T): PayloadByKey[T] | null;
  public get<T extends StorageKey>(key: T, fallback: PayloadByKey[T]): PayloadByKey[T];
  public get<T extends StorageKey>(key: T, fallback?: PayloadByKey[T]): PayloadByKey[T] | null {
    const defaultValue = fallback || null;

    if (!this.isLocalStorageAvailable) {
      return defaultValue;
    }

    const data = localStorage.getItem(key);

    try {
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      localStorage.removeItem(key);
      return defaultValue;
    }
  }

  public remove<T extends StorageKey>(key: T): void {
    this.isLocalStorageAvailable && localStorage.removeItem(key);
  }
}

export { LocalStorage };
