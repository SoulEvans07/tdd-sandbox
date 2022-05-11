import { createContext, PropsWithChildren, ReactElement, useContext, useMemo, useState } from 'react';
import { ArrayHelpers } from '../helpers/ArrayHelpers';

export const themes = ['dark', 'light'] as const;

export type ThemeName = typeof themes[number];
type ThemeSetter = (theme: ThemeName) => void;
type ThemeSwitcher = () => void;
interface ThemeContext {
  currentTheme: ThemeName;
  switchTheme: ThemeSwitcher;
  setTheme: ThemeSetter;
}

const Theme = createContext<ThemeContext | undefined>(undefined);

export function useTheme() {
  const context = useContext(Theme);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

interface ThemeProviderProps {
  initial: ThemeName;
  onChange?: (theme: ThemeName) => void;
}

export function ThemeProvider(props: PropsWithChildren<ThemeProviderProps>): ReactElement {
  const { initial, onChange, ...restProps } = props;
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(initial);

  const value = useMemo((): ThemeContext => {
    const setTheme = (theme: ThemeName) => {
      setCurrentTheme(theme);
      if (onChange) onChange(theme);
    };

    const switchTheme = () => setTheme(ArrayHelpers.next(themes as unknown as ThemeName[], currentTheme));

    return { currentTheme, switchTheme, setTheme };
  }, [currentTheme]);

  return <Theme.Provider value={value} {...restProps} />;
}
