import Locale from '../locales/en/translation.json';

type LK = keyof typeof Locale;
type KeyMap = Record<LK, string>;

export const R = Object.keys(Locale).reduce(
  (acc, current): KeyMap => ({
    ...acc,
    [current]: current,
  }),
  {} as KeyMap
);
