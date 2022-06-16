var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ArrayHelpers = /** @class */ (function () {
    function ArrayHelpers() {
    }
    ArrayHelpers.cycle = function (array, count) {
        if (count === void 0) { count = 1; }
        var cycles = count % array.length;
        var start = array.slice(0, cycles);
        var end = array.slice(cycles);
        return __spreadArray(__spreadArray([], end, true), start, true);
    };
    ArrayHelpers.next = function (array, item) {
        var nextIndex = array.indexOf(item) + 1;
        var nextValidIndex = nextIndex % array.length;
        return array[nextValidIndex];
    };
    ArrayHelpers.filterBy = function (array, key, filter) {
        return array.filter(function (item) { return !filter || item[key] === filter; });
    };
    ArrayHelpers.filterPickBy = function (array, pick, key, filter) {
        return array.reduce(function (acc, curr) {
            if (!filter || curr[key] === filter) {
                acc[0].push(curr);
                acc[1].push(curr[pick]);
            }
            return acc;
        }, [[], []]);
    };
    return ArrayHelpers;
}());
export { ArrayHelpers };
//# sourceMappingURL=ArrayHelpers.js.map