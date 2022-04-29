import { StringHelper } from './StringHelper';

describe('StringHelper', () => {
  describe('camelToKebab', () => {
    it('returns the same if there is no uppercase char', () => {
      const nouppercase = 'nouppercase';
      expect(StringHelper.camelToKebab(nouppercase)).toBe(nouppercase);
      expect(StringHelper.camelToKebab('')).toBe('');
    });

    it('converts all to lowercase if only first char is capital', () => {
      expect(StringHelper.camelToKebab('Capital')).toBe('capital');
    });

    it('works with one inner capital letter', () => {
      expect(StringHelper.camelToKebab('stringHelper')).toBe('string-helper');
    });

    it('works with multiple inner capital letters wo/ starting capital', () => {
      expect(StringHelper.camelToKebab('stringHelperFile')).toBe('string-helper-file');
    });

    it('works with multiple inner capital letters w/ starting capital', () => {
      expect(StringHelper.camelToKebab('StringHelperFile')).toBe('string-helper-file');
    });
  });
});
