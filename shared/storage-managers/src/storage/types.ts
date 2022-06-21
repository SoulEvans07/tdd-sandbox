export interface IStorageManager {
  set(key: string, data: any): void;
  get<T>(key: string): T | undefined;
  remove(key: string): void;
}

export interface ISecureStorageManager extends IStorageManager {
  set(key: string, data: any, expires?: Date, options?: Record<string, any>): void;
}
