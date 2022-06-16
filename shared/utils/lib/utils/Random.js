var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.number = function (size) {
        if (size === void 0) { size = 1; }
        return Math.floor(Math.random() * size);
    };
    Random.string = function (length) {
        var _this = this;
        if (length < 1)
            throw new InvalidArgumentException('length must be bigger than 0');
        return new Array(length)
            .fill(null)
            .map(function () { return String.fromCharCode(97 + _this.number(26)); })
            .join('');
    };
    Random.choose = function (array, count) {
        if (count === undefined)
            return array[this.number(array.length - 1)];
        if (count < 1)
            throw new InvalidArgumentException('count must be bigger than 0');
        var randomized = __spreadArray([], array, true).sort(function () { return (Math.random() > 0.5 ? 1 : -1); });
        return randomized.slice(0, count);
    };
    return Random;
}());
export { Random };
var InvalidArgumentException = /** @class */ (function (_super) {
    __extends(InvalidArgumentException, _super);
    function InvalidArgumentException() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'InvalidArgumentException';
        return _this;
    }
    return InvalidArgumentException;
}(Error));
export { InvalidArgumentException };
//# sourceMappingURL=Random.js.map