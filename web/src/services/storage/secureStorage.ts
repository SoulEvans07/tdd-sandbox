import { ISecureStorageManager } from './types';

export interface CookieOption {
  'max-age'?: string;
  path?: string;
}

function set(key: string, data: any, expires?: Date, options?: CookieOption) {
  const cookieOptions = { path: '/', ...options, expires: expires?.toUTCString() };
  const serializedOptions = Object.entries(cookieOptions).reduce((acc, [key, value]) => acc + `${key}=${value};`, '');
  const sameSiteOption = window.location.protocol === 'https:' ? '; SameSite=None; Secure' : '; SameSite=Lax;';
  const serializedData = JSON.stringify(data);
  document.cookie = `${key}=${serializedData}; ${serializedOptions} ${sameSiteOption}`;
}

function get<T>(key: string): T | undefined {
  const keyPairs = document.cookie.split(';');

  const cookies = keyPairs.reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=');
    return acc.set(key, value);
  }, new Map<string, string>());

  const serialized = cookies.get(key);
  if (!serialized) return undefined;
  return JSON.parse(serialized);
}

function remove(key: string, options?: CookieOption): void {
  set(key, '', new Date(), options);
}

export const secureStorage: ISecureStorageManager = { set, get, remove } as const;
