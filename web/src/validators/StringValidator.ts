import { InputValidator } from './types';
import { ValidatorBase } from './ValidatorBase';

export class StringValidator extends ValidatorBase {
  static defaults = {
    minLen: 'Text is too short',
    maxLen: 'Text is too long',
    match: "Text doesn't match",
  };

  static minLen(min: number, errorMessage?: string): InputValidator {
    return text => {
      if (text.length < min) return errorMessage || StringValidator.defaults.minLen;
      return null;
    };
  }

  static maxLen(max: number, errorMessage?: string): InputValidator {
    return text => {
      if (text.length > max) return errorMessage || StringValidator.defaults.maxLen;
      return null;
    };
  }

  static match(pattern: string | RegExp, errorMessage?: string): InputValidator {
    const message = errorMessage || StringValidator.defaults.match;
    return text => {
      if (typeof pattern === 'string') return pattern !== text ? message : null;
      return !pattern.test(text) ? message : null;
    };
  }
}
