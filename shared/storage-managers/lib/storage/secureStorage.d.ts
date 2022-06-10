import { ISecureStorageManager } from "./types";
export interface CookieOption {
    "max-age"?: string;
    path?: string;
}
export declare const secureStorage: ISecureStorageManager;
