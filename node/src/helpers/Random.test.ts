import { InvalidArgumentException, Random } from './Random';

describe('Random', () => {
  describe('number', () => {
    test('size argument defaults to 1', () => {
      const value = Random.number();
      expect(value).toBeWithin(0, 1);
    });

    test('negative size results in value between 0 and given negative value', () => {
      expect(Random.number(-5)).toBeWithin(-5, 0);
    });

    test('poisitve size results in value between 0 and given positive value', () => {
      expect(Random.number(5)).toBeWithin(0, 5);
    });
  });

  describe('string', () => {
    it('throws InvalidArgumentException when length < 1', () => {
      expect(() => Random.string(0)).toThrowType(InvalidArgumentException);
    });

    test('output length is equal to the argument', () => {
      const length = 5;
      expect(Random.string(length)).toHaveLength(length);
    });

    test('only returns lowercase characters [a-z]', () => {
      expect(Random.string(100)).toMatch(/^[a-z]{100}$/);
    });
  });

  describe('choose', () => {
    const array = [0, 1, 2, 3, 4, 5];

    it('returns with single value if count is not set', () => {
      const value = Random.choose(array);
      expect(value).not.toBeArray();
      expect(value).toBeNumber();
    });

    it('returns with accurate amout of values if count is set', () => {
      const count = 3;
      const value = Random.choose(array, count);
      expect(value).toBeArray();
      expect(value).toHaveLength(3);
    });

    it('throws error when count < 0', () => {
      expect(() => Random.choose(array, 0)).toThrowType(InvalidArgumentException);
      expect(() => Random.choose(array, -10)).toThrowType(InvalidArgumentException);
    });
  });
});
