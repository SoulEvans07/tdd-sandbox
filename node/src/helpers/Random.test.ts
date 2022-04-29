import { InvalidArgumentException, Random } from './Random';
import 'jest-extended';

describe('Random', () => {
  describe('number', () => {
    test('size argument defaults to 1', () => {
      const value = Random.number();
      expect(value).toBeWithin(0, 1);
    });
  });

  describe('string', () => {
    it('throws InvalidArgumentException when length < 1', () => {
      expect(() => Random.string(0)).toThrowType(InvalidArgumentException);
    });
  });
});
