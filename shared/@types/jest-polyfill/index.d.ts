export * from 'jest-extended';
import * as _jest from '@types/jest';

declare global {
  namespace jest {
    interface Matchers<R, T = {}> extends _jest.Matchers<R, T> {
      toThrowType(errorType: new () => Error): R;
    }
  }
}
