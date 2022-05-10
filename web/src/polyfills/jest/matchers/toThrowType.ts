// made based on https://github.dev/jest-community/jest-extended/blob/main/src/matchers/toThrowWithMessage.js

import { MatcherContext, MatcherUtils } from '../types';
import { failObj, passObj } from '../utils';

const positiveHint = (utils: MatcherUtils) => utils.matcherHint('.toThrowType', 'function', 'type');

const negativeHint = (utils: MatcherUtils) => utils.matcherHint('.not.toThrowType', 'function', 'type');

const passMessage = (utils: MatcherUtils, received: any, expected: any) => () =>
  negativeHint(utils) +
  '\n\n' +
  'Expected not to throw:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Thrown:\n' +
  `  ${utils.printReceived(received)}\n`;

const failMessage = (utils: MatcherUtils, received: any, expected: any) => () =>
  positiveHint(utils) +
  '\n\n' +
  'Expected to throw:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Thrown:\n' +
  `  ${utils.printReceived(received)}\n`;

export function toThrowType(this: MatcherContext, callbackOrPromiseReturn: any, type: new () => Error) {
  const utils = this.utils;
  const isFromReject = this && this.promise === 'rejects'; // See https://github.com/facebook/jest/pull/7621#issue-244312550

  if ((!callbackOrPromiseReturn || typeof callbackOrPromiseReturn !== 'function') && !isFromReject) {
    return failObj(
      () =>
        positiveHint(utils) +
        '\n\n' +
        `Received value must be a function but instead "${callbackOrPromiseReturn}" was found`
    );
  }

  if (!type || typeof type !== 'function') {
    return failObj(() => `${positiveHint(utils)}\n\nExpected type to be a function but instead "${type}" was found`);
  }

  let error: Error | undefined;
  if (isFromReject) {
    error = callbackOrPromiseReturn;
  } else {
    try {
      callbackOrPromiseReturn();
    } catch (e) {
      error = e as Error;
    }
  }

  if (!error) {
    return failObj(() => `Expected the function to throw an error.\nBut it didn't throw anything.`);
  }

  const pass = error.name === new type().name;
  if (pass) return passObj(passMessage(utils, error, new type()));
  else return failObj(failMessage(utils, error, new type()));
}
