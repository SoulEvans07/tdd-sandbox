import { IStorageManager } from './types';

function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function get<T>(key: string): T | undefined {
  const serialized = localStorage.getItem(key);
  if (!serialized) return undefined;
  return JSON.parse(serialized);
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const persistentStorage: IStorageManager = { set, get, remove } as const;
