function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function get(key) {
    var serialized = localStorage.getItem(key);
    if (!serialized)
        return undefined;
    return JSON.parse(serialized);
}
function remove(key) {
    localStorage.removeItem(key);
}
export var persistentStorage = { set: set, get: get, remove: remove };
//# sourceMappingURL=persistentStorage.js.map