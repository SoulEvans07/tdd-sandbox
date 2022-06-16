import { InvalidArgumentException, Random } from './Random';
describe('Random', function () {
    describe('number', function () {
        test('size argument defaults to 1', function () {
            var value = Random.number();
            expect(value).toBeWithin(0, 1);
        });
        test('negative size results in value between 0 and given negative value', function () {
            expect(Random.number(-5)).toBeWithin(-5, 0);
        });
        test('poisitve size results in value between 0 and given positive value', function () {
            expect(Random.number(5)).toBeWithin(0, 5);
        });
    });
    describe('string', function () {
        it('throws InvalidArgumentException when length < 1', function () {
            expect(function () { return Random.string(0); }).toThrowType(InvalidArgumentException);
        });
        test('output length is equal to the argument', function () {
            var length = 5;
            expect(Random.string(length)).toHaveLength(length);
        });
        test('only returns lowercase characters [a-z]', function () {
            expect(Random.string(100)).toMatch(/^[a-z]{100}$/);
        });
    });
    describe('choose', function () {
        var array = [0, 1, 2, 3, 4, 5];
        it('returns with single value if count is not set', function () {
            var value = Random.choose(array);
            expect(value).not.toBeArray();
            expect(value).toBeNumber();
        });
        it('returns with accurate amout of values if count is set', function () {
            var count = 3;
            var value = Random.choose(array, count);
            expect(value).toBeArray();
            expect(value).toHaveLength(3);
        });
        it('throws error when count < 0', function () {
            expect(function () { return Random.choose(array, 0); }).toThrowType(InvalidArgumentException);
            expect(function () { return Random.choose(array, -10); }).toThrowType(InvalidArgumentException);
        });
    });
});
//# sourceMappingURL=Random.test.js.map