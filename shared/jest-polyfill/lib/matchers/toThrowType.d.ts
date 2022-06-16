import { MatcherContext } from '../types';
export declare function toThrowType(this: MatcherContext, callbackOrPromiseReturn: any, type: new () => Error): {
    pass: boolean;
    message: () => string;
};
