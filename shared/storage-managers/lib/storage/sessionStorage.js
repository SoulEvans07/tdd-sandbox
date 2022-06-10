var sessionStore = window.sessionStorage;
function set(key, value) {
    sessionStore.setItem(key, JSON.stringify(value));
}
function get(key) {
    var serialized = sessionStore.getItem(key);
    if (!serialized)
        return undefined;
    return JSON.parse(serialized);
}
function remove(key) {
    sessionStore.removeItem(key);
}
export var sessionStorage = { set: set, get: get, remove: remove };
//# sourceMappingURL=sessionStorage.js.map