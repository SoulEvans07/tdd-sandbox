import { textToHue } from './color';
import { Random } from './Random';
describe('color helpers', function () {
    describe('textToHue', function () {
        it("doesn't return bigger number than 360", function () {
            expect(textToHue('')).toBeLessThanOrEqual(360);
            expect(textToHue('a')).toBeLessThanOrEqual(360);
            expect(textToHue('b'.repeat(1000))).toBeLessThanOrEqual(360);
            expect(textToHue(Random.string(400))).toBeLessThanOrEqual(360);
        });
    });
});
//# sourceMappingURL=color.test.js.map