// made based on https://github.dev/jest-community/jest-extended/blob/main/src/matchers/toThrowWithMessage.js
import { failObj, passObj } from '../utils';
var positiveHint = function (utils) { return utils.matcherHint('.toThrowType', 'function', 'type'); };
var negativeHint = function (utils) { return utils.matcherHint('.not.toThrowType', 'function', 'type'); };
var passMessage = function (utils, received, expected) { return function () {
    return negativeHint(utils) +
        '\n\n' +
        'Expected not to throw:\n' +
        "  ".concat(utils.printExpected(expected), "\n") +
        'Thrown:\n' +
        "  ".concat(utils.printReceived(received), "\n");
}; };
var failMessage = function (utils, received, expected) { return function () {
    return positiveHint(utils) +
        '\n\n' +
        'Expected to throw:\n' +
        "  ".concat(utils.printExpected(expected), "\n") +
        'Thrown:\n' +
        "  ".concat(utils.printReceived(received), "\n");
}; };
export function toThrowType(callbackOrPromiseReturn, type) {
    var utils = this.utils;
    var isFromReject = this && this.promise === 'rejects'; // See https://github.com/facebook/jest/pull/7621#issue-244312550
    if ((!callbackOrPromiseReturn || typeof callbackOrPromiseReturn !== 'function') && !isFromReject) {
        return failObj(function () {
            return positiveHint(utils) +
                '\n\n' +
                "Received value must be a function but instead \"".concat(callbackOrPromiseReturn, "\" was found");
        });
    }
    if (!type || typeof type !== 'function') {
        return failObj(function () { return "".concat(positiveHint(utils), "\n\nExpected type to be a function but instead \"").concat(type, "\" was found"); });
    }
    var error;
    if (isFromReject) {
        error = callbackOrPromiseReturn;
    }
    else {
        try {
            callbackOrPromiseReturn();
        }
        catch (e) {
            error = e;
        }
    }
    if (!error) {
        return failObj(function () { return "Expected the function to throw an error.\nBut it didn't throw anything."; });
    }
    var pass = error.name === new type().name;
    if (pass)
        return passObj(passMessage(utils, error, new type()));
    else
        return failObj(failMessage(utils, error, new type()));
}
//# sourceMappingURL=toThrowType.js.map