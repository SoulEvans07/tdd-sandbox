import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { ThemeName, useTheme } from '../../contexts/theme/ThemeContext';

const themePrefix = 'theme-';

function clearTheme() {
  const activeThemes = Array.from(document.body.classList).filter(className => className.startsWith(themePrefix));
  activeThemes.forEach(className => document.body.classList.remove(className));
}

function addTheme(theme: ThemeName) {
  document.body.classList.add(themePrefix + theme);
}

export function ThemeSetter(props: PropsWithChildren<{}>): ReactElement {
  const { children } = props;
  const { currentTheme } = useTheme();

  useEffect(() => {
    clearTheme();
    addTheme(currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
}
