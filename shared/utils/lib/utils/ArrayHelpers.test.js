import { ArrayHelpers } from './ArrayHelpers';
describe('ArrayHelpers', function () {
    describe('cycle', function () {
        var testArray = [0, 1, 2, 3];
        test.each([
            [testArray, 0, testArray],
            [testArray, testArray.length, testArray],
            [testArray, 1, [1, 2, 3, 0]],
            [testArray, 3, [3, 0, 1, 2]],
            [testArray, 2, [2, 3, 0, 1]],
            [testArray, 6, [2, 3, 0, 1]],
            [testArray, -2, [2, 3, 0, 1]],
        ])('%s cycle %s times', function (array, count, expected) {
            expect(ArrayHelpers.cycle(array, count)).toEqual(expected);
        });
    });
    describe('next', function () {
        var testArray = ['a', 'b', 'c', 'd'];
        test.each([
            [testArray, 'a', 'b'],
            [testArray, 'b', 'c'],
            [testArray, 'c', 'd'],
            [testArray, 'd', 'a'],
        ])('%s cycle %s times', function (array, count, expected) {
            expect(ArrayHelpers.next(array, count)).toEqual(expected);
        });
    });
    var list = [
        { id: 0, a: 1, b: 'A' },
        { id: 1, a: 1, b: 'B' },
        { id: 2, a: 2, b: 'B' },
        { id: 3, a: 2, b: 'A' },
        { id: 4, a: 2, b: 'A' },
    ];
    describe.each([
        { list: list, by: 'a', value: 2, expected: [2, 3, 4] },
        { list: list, by: 'a', value: undefined, expected: [0, 1, 2, 3, 4] },
        { list: list, by: 'b', value: 'B', expected: [1, 2] },
        { list: list, by: 'b', value: undefined, expected: [0, 1, 2, 3, 4] },
    ])('filterBy', function (_a) {
        var list = _a.list, by = _a.by, value = _a.value, expected = _a.expected;
        test("filterBy ".concat(by, " = ").concat(value), function () {
            var filtered = ArrayHelpers.filterBy(list, by, value);
            var ids = filtered.map(function (item) { return item.id; });
            expect(ids).toEqual(expected);
        });
    });
    describe.each([
        { list: list, by: 'a', value: 1, pick: 'a', picked: [1, 1], filtered: [0, 1] },
        {
            list: list,
            by: 'a',
            value: 2,
            pick: 'id',
            picked: [2, 3, 4],
            filtered: [2, 3, 4],
        },
        {
            list: list,
            by: 'a',
            value: undefined,
            pick: 'id',
            picked: [0, 1, 2, 3, 4],
            filtered: [0, 1, 2, 3, 4],
        },
        {
            list: list,
            by: 'b',
            value: 'A',
            pick: 'b',
            picked: ['A', 'A', 'A'],
            filtered: [0, 3, 4],
        },
        { list: list, by: 'b', value: 'B', pick: 'id', picked: [1, 2], filtered: [1, 2] },
        {
            list: list,
            by: 'b',
            value: undefined,
            pick: 'id',
            picked: [0, 1, 2, 3, 4],
            filtered: [0, 1, 2, 3, 4],
        },
    ])('filterBy', function (_a) {
        var list = _a.list, by = _a.by, value = _a.value, pick = _a.pick, picked = _a.picked, filtered = _a.filtered;
        test("filterPickBy ".concat(by, " = ").concat(value, "; pick: ").concat(pick), function () {
            var _a = ArrayHelpers.filterPickBy(list, pick, by, value), flist = _a[0], plist = _a[1];
            var ids = flist.map(function (item) { return item.id; });
            expect(ids).toEqual(filtered);
            expect(plist).toEqual(picked);
        });
    });
});
//# sourceMappingURL=ArrayHelpers.test.js.map