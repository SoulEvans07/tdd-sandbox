import { textToHue } from './color';
import { Random } from './Random';

describe('color helpers', () => {
  describe('textToHue', () => {
    it("doesn't return bigger number than 360", () => {
      expect(textToHue('')).toBeLessThanOrEqual(360);
      expect(textToHue('a')).toBeLessThanOrEqual(360);
      expect(textToHue('b'.repeat(1000))).toBeLessThanOrEqual(360);
      expect(textToHue(Random.string(400))).toBeLessThanOrEqual(360);
    });
  });
});
