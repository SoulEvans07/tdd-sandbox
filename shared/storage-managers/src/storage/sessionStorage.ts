import { IStorageManager } from "./types";

const sessionStore = window.sessionStorage;

function set(key: string, value: any) {
  sessionStore.setItem(key, JSON.stringify(value));
}

function get<T>(key: string): T | undefined {
  const serialized = sessionStore.getItem(key);
  if (!serialized) return undefined;
  return JSON.parse(serialized);
}

function remove(key: string): void {
  sessionStore.removeItem(key);
}

export const sessionStorage: IStorageManager = { set, get, remove } as const;
