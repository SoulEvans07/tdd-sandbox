var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function set(key, data, expires, options) {
    var cookieOptions = __assign(__assign({ path: "/" }, options), { expires: expires === null || expires === void 0 ? void 0 : expires.toUTCString() });
    var serializedOptions = Object.entries(cookieOptions).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        return acc + "".concat(key, "=").concat(value, ";");
    }, "");
    var sameSiteOption = window.location.protocol === "https:"
        ? "; SameSite=None; Secure"
        : "; SameSite=Lax;";
    var serializedData = JSON.stringify(data);
    document.cookie = "".concat(key, "=").concat(serializedData, "; ").concat(serializedOptions, " ").concat(sameSiteOption);
}
function get(key) {
    var keyPairs = document.cookie.split(";");
    var cookies = keyPairs.reduce(function (acc, curr) {
        var _a = curr.trim().split("="), key = _a[0], value = _a[1];
        return acc.set(key, value);
    }, new Map());
    var serialized = cookies.get(key);
    if (!serialized)
        return undefined;
    return JSON.parse(serialized);
}
function remove(key, options) {
    set(key, "", new Date(), options);
}
export var secureStorage = {
    set: set,
    get: get,
    remove: remove,
};
//# sourceMappingURL=secureStorage.js.map