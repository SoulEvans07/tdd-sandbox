import { ArrayHelpers } from './ArrayHelpers';

describe('ArrayHelpers', () => {
  describe('cycle', () => {
    const testArray = [0, 1, 2, 3];
    test.each([
      [testArray, 0, testArray],
      [testArray, testArray.length, testArray],
      [testArray, 1, [1, 2, 3, 0]],
      [testArray, 3, [3, 0, 1, 2]],
      [testArray, 2, [2, 3, 0, 1]],
      [testArray, 6, [2, 3, 0, 1]],
      [testArray, -2, [2, 3, 0, 1]],
    ])('%s cycle %s times', (array, count, expected) => {
      expect(ArrayHelpers.cycle(array, count)).toEqual(expected);
    });
  });

  describe('next', () => {
    const testArray = ['a', 'b', 'c', 'd'];
    test.each([
      [testArray, 'a', 'b'],
      [testArray, 'b', 'c'],
      [testArray, 'c', 'd'],
      [testArray, 'd', 'a'],
    ])('%s cycle %s times', (array, count, expected) => {
      expect(ArrayHelpers.next(array, count)).toEqual(expected);
    });
  });
});
