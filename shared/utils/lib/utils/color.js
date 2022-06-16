export function textToHue(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 6) - hash);
    }
    return Math.abs(hash) % 360;
}
//# sourceMappingURL=color.js.map