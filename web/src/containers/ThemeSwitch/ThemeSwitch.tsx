import { ReactElement } from 'react';
import './ThemeSwitch.scss';
import { Icon } from '../../components/ui/Icon/Icon';
import { ThemeName, useTheme } from '../../contexts/ThemeContext';

const themeIcons: Record<ThemeName, string> = {
  dark: 'sun',
  light: 'moon',
};

export function ThemeSwitch(): ReactElement {
  const { currentTheme, switchTheme } = useTheme();
  const icon = themeIcons[currentTheme];

  return (
    <Icon
      className="theme-switch"
      icon={icon}
      onClick={switchTheme}
      role="checkbox"
      aria-checked={currentTheme === 'dark'}
    />
  );
}
