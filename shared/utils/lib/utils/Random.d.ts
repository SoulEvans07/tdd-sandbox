export declare class Random {
    static number(size?: number): number;
    static string(length: number): string;
    static choose<T>(array: T[]): T;
    static choose<T>(array: T[], count: number): T[];
}
export declare class InvalidArgumentException extends Error {
    name: string;
}
