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

  type ListData = { id: number; a: number; b: string };
  const list: ListData[] = [
    { id: 0, a: 1, b: 'A' },
    { id: 1, a: 1, b: 'B' },
    { id: 2, a: 2, b: 'B' },
    { id: 3, a: 2, b: 'A' },
    { id: 4, a: 2, b: 'A' },
  ];

  type FilterByTestCase = {
    list: ListData[];
    by: keyof ListData;
    value: ListData[FilterByTestCase['by']] | undefined;
    expected: Array<typeof list[number]['id']>;
  };

  describe.each<FilterByTestCase>([
    { list, by: 'a', value: 2, expected: [2, 3, 4] },
    { list, by: 'a', value: undefined, expected: [0, 1, 2, 3, 4] },
    { list, by: 'b', value: 'B', expected: [1, 2] },
    { list, by: 'b', value: undefined, expected: [0, 1, 2, 3, 4] },
  ])('filterBy', ({ list, by, value, expected }) => {
    test(`filterBy ${by} = ${value}`, () => {
      const filtered = ArrayHelpers.filterBy(list, by, value);
      const ids = filtered.map(item => item.id);
      expect(ids).toEqual(expected);
    });
  });

  type FilterPickByTestCase = {
    list: ListData[];
    by: keyof ListData;
    value: ListData[FilterByTestCase['by']] | undefined;
    pick: keyof ListData;
    picked: Array<typeof list[number][FilterPickByTestCase['pick']]>;
    filtered: Array<typeof list[number]['id']>;
  };

  describe.each<FilterPickByTestCase>([
    { list, by: 'a', value: 1, pick: 'a', picked: [1, 1], filtered: [0, 1] },
    {
      list,
      by: 'a',
      value: 2,
      pick: 'id',
      picked: [2, 3, 4],
      filtered: [2, 3, 4],
    },
    {
      list,
      by: 'a',
      value: undefined,
      pick: 'id',
      picked: [0, 1, 2, 3, 4],
      filtered: [0, 1, 2, 3, 4],
    },
    {
      list,
      by: 'b',
      value: 'A',
      pick: 'b',
      picked: ['A', 'A', 'A'],
      filtered: [0, 3, 4],
    },
    { list, by: 'b', value: 'B', pick: 'id', picked: [1, 2], filtered: [1, 2] },
    {
      list,
      by: 'b',
      value: undefined,
      pick: 'id',
      picked: [0, 1, 2, 3, 4],
      filtered: [0, 1, 2, 3, 4],
    },
  ])('filterBy', ({ list, by, value, pick, picked, filtered }) => {
    test(`filterPickBy ${by} = ${value}; pick: ${pick}`, () => {
      const [flist, plist] = ArrayHelpers.filterPickBy(list, pick, by, value);
      const ids = flist.map(item => item.id);
      expect(ids).toEqual(filtered);
      expect(plist).toEqual(picked);
    });
  });
});
