import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { ArrayHelpers } from '../helpers/ArrayHelpers';
import { persistentStorage } from '../services/storage/persistentStorage';

export const themeStoreKey = 'io.todo.theme';
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
  default?: ThemeName;
}

export function ThemeProvider(props: PropsWithChildren<ThemeProviderProps>): ReactElement {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(props.default || 'dark');

  useEffect(() => {
    const storedValue = persistentStorage.get<ThemeName>(themeStoreKey);
    setCurrentTheme(storedValue || props.default || 'dark');
  }, []);

  const value = useMemo((): ThemeContext => {
    const setTheme = (theme: ThemeName) => {
      setCurrentTheme(theme);
      persistentStorage.set(themeStoreKey, theme);
    };

    const switchTheme = () => setTheme(ArrayHelpers.next(themes as unknown as ThemeName[], currentTheme));

    return { currentTheme, switchTheme, setTheme };
  }, [currentTheme]);

  return <Theme.Provider value={value} {...props} />;
}
