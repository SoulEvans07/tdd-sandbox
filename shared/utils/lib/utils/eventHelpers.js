export function stopPropagation(eventHandler) {
    return function (event) {
        event.stopPropagation();
        eventHandler(event);
    };
}
//# sourceMappingURL=eventHelpers.js.map