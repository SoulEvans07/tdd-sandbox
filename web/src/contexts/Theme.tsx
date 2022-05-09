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
  if (!context) throw new Error('useTheme must be used within an ThemeProvider');
  return context;
}

interface ThemeProviderProps {
  default?: ThemeName;
}

type NewType = ReactElement;

export function ThemeProvider(props: PropsWithChildren<ThemeProviderProps>): NewType {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(props.default || 'dark');

  const value = useMemo((): ThemeContext => {
    const switchTheme = () => setCurrentTheme(prev => ArrayHelpers.next(themes as unknown as ThemeName[], prev));
    const setTheme = (theme: ThemeName) => setCurrentTheme(theme);
    return { currentTheme, switchTheme, setTheme };
  }, [currentTheme]);

  return <Theme.Provider value={value} {...props} />;
}
