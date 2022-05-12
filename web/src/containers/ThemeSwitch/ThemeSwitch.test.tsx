import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ThemeSetter } from './ThemeSetter';
import { ThemeSwitch } from './ThemeSwitch';

describe('ThemeSwitch', () => {
  it('renders an svg icon as a checkbox', () => {
    render(
      <ThemeProvider initial="dark">
        <ThemeSwitch />
      </ThemeProvider>
    );

    const themeSwitch = screen.getByRole('checkbox');
    expect(themeSwitch.tagName).toBe('svg');
  });

  it('behaves like a checkbox and changes icon', () => {
    render(
      <ThemeProvider initial="light">
        <ThemeSwitch />
      </ThemeProvider>
    );

    // TODO: icon change cannot be tested because of the weird way I handle svg import right now. @adam.szi

    const themeSwitch = screen.getByRole('checkbox');
    expect(themeSwitch).not.toBeChecked();

    userEvent.click(themeSwitch);
    expect(themeSwitch).toBeChecked();

    userEvent.click(themeSwitch);
    expect(themeSwitch).not.toBeChecked();
  });

  it('changes the theme class on the body when clicked', () => {
    render(
      <ThemeProvider initial="dark">
        <ThemeSetter>
          <ThemeSwitch />
        </ThemeSetter>
      </ThemeProvider>
    );

    expect(document.body).toHaveClass('theme-dark');
    const themeSwitch = screen.getByRole('checkbox');
    userEvent.click(themeSwitch);
    expect(document.body).toHaveClass('theme-light');
  });
});
