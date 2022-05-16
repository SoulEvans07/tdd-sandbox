import { StringValidator } from './StringValidator';
import { strongPasswordRegEx } from './types';

const { defaults, compose, minLen, maxLen, match } = StringValidator;

describe('String Validators', () => {
  describe.each<{ min: number; text: string; shouldFail: boolean }>([
    { min: 0, text: '', shouldFail: false },
    { min: 8, text: '', shouldFail: true },
    { min: 8, text: '1234567', shouldFail: true },
    { min: 8, text: '12345678', shouldFail: false },
    { min: 8, text: '1234567890', shouldFail: false },
  ])('minLen', ({ min, text, shouldFail }) => {
    test(`[min: ${min}] "${text}" should ${shouldFail ? 'fail' : 'pass'}`, () => {
      const response = minLen(min)(text);
      expect(response).toBe(shouldFail ? defaults.minLen : null);
    });
  });

  describe.each<{ max: number; text: string; shouldFail: boolean }>([
    { max: 0, text: '', shouldFail: false },
    { max: 8, text: '', shouldFail: false },
    { max: 8, text: '1234567', shouldFail: false },
    { max: 8, text: '12345678', shouldFail: false },
    { max: 8, text: '1234567890', shouldFail: true },
  ])('maxLen', ({ max, text, shouldFail }) => {
    test(`[max: ${max}] "${text}" should ${shouldFail ? 'fail' : 'pass'}`, () => {
      const response = maxLen(max)(text);
      expect(response).toBe(shouldFail ? defaults.maxLen : null);
    });
  });

  describe.each<{ pattern: string | RegExp; text: string; shouldFail: boolean }>([
    { pattern: '12345', text: '12345', shouldFail: false },
    { pattern: '12345', text: '1234567', shouldFail: true },
    { pattern: /message/i, text: 'message', shouldFail: false },
    { pattern: /message/i, text: 'error-Message', shouldFail: false },
    { pattern: /message/i, text: 'meSSage-queue', shouldFail: false },
    { pattern: /message/i, text: 'random-messaGe-block', shouldFail: false },
    { pattern: /message/i, text: 'massage', shouldFail: true },
  ])('match', ({ pattern, text, shouldFail }) => {
    test(`[match: ${pattern.toString()}] "${text}" should ${shouldFail ? 'fail' : 'pass'}`, () => {
      const response = match(pattern)(text);
      expect(response).toBe(shouldFail ? defaults.match : null);
    });
  });

  describe('compose', () => {
    describe.each<{ min: number; max: number; text: string; shouldThrow: 'minLen' | 'maxLen' | null }>([
      { min: 0, max: 0, text: '', shouldThrow: null },
      { min: 4, max: 8, text: '', shouldThrow: 'minLen' },
      { min: 4, max: 8, text: '1', shouldThrow: 'minLen' },
      { min: 4, max: 8, text: '1234', shouldThrow: null },
      { min: 4, max: 8, text: '12345', shouldThrow: null },
      { min: 4, max: 8, text: '12345678', shouldThrow: null },
      { min: 4, max: 8, text: '1234567890', shouldThrow: 'maxLen' },
    ])('min + max', ({ min, max, text, shouldThrow }) => {
      test(`[min: ${min}, max: ${max}] "${text}" should ${shouldThrow ? 'fail' : 'pass'}`, () => {
        const validators = [minLen(min), maxLen(max)];
        const response = compose(...validators)(text);
        expect(response).toBe(shouldThrow ? defaults[shouldThrow] : null);
      });
    });

    describe.each<{ text: string; shouldThrow: 'minLen' | 'maxLen' | 'match' | null }>([
      { text: '', shouldThrow: 'minLen' },
      { text: '1', shouldThrow: 'minLen' },
      { text: 'Pa$', shouldThrow: 'minLen' },
      { text: '1234', shouldThrow: 'match' },
      { text: '12345', shouldThrow: 'match' },
      { text: '12345678', shouldThrow: 'match' },
      { text: '1234567890', shouldThrow: 'maxLen' },
      { text: 'ThePass123!', shouldThrow: 'maxLen' },
      { text: 'Pass123!', shouldThrow: null },
    ])('nested: combine(combine(min, max), match)', ({ text, shouldThrow }) => {
      test(`[min: 4, max: 8, match: <password>] "${text}" should ${shouldThrow ? 'fail' : 'pass'}`, () => {
        const validator = compose(compose(minLen(4), maxLen(8)), match(strongPasswordRegEx));
        expect(validator(text)).toBe(shouldThrow ? defaults[shouldThrow] : null);
      });
    });
  });
});
