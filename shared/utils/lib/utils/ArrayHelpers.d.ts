export declare type ListPickTuple<LI extends Record<string, any>, P extends keyof LI> = [Array<LI>, Array<LI[P]>];
export declare class ArrayHelpers {
    static cycle<T>(array: T[], count?: number): T[];
    static next<T>(array: T[], item: typeof array[number]): T;
    static filterBy<T extends Record<string, any>>(array: T[], key: keyof T, filter?: T[typeof key]): T[];
    static filterPickBy<T extends Record<string, any>>(array: T[], pick: keyof T, key: keyof T, filter?: T[typeof key]): ListPickTuple<T, typeof key>;
}
