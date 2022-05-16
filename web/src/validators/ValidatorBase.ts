import { InputValidator } from './types';

export abstract class ValidatorBase {
  static compose(...validators: InputValidator[]): InputValidator {
    return (value: string) => {
      for (const validator of validators) {
        const error = validator(value);
        if (!!error) return error;
      }
      return null;
    };
  }
}
