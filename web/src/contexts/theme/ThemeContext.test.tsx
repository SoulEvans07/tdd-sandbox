import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { ThemeConsumer, ThemeName, ThemeProvider } from './ThemeContext';

describe('ThemeContext', () => {
  const customRender = (ui: ReactNode, theme: ThemeName) => {
    return render(<ThemeProvider initial={theme}>{ui}</ThemeProvider>);
  };

  it('uses initial value', () => {
    const initTheme = 'dark';
    customRender(<ThemeConsumer>{value => <div>{value?.currentTheme}</div>}</ThemeConsumer>, initTheme);
    expect(screen.getByText(initTheme)).toBeInTheDocument();
  });

  describe.each<{ from: ThemeName; to: ThemeName }>([
    { from: 'dark', to: 'light' },
    { from: 'light', to: 'dark' },
  ])('setTheme', ({ from, to }) => {
    it(`${from} => ${to} => ${to}`, () => {
      customRender(
        <ThemeConsumer>
          {value => {
            if (!value) return <>Loading</>;
            const { currentTheme, setTheme } = value;
            return <div onClick={() => setTheme(to)}>{currentTheme}</div>;
          }}
        </ThemeConsumer>,
        from
      );

      const theme = screen.getByText(from);
      expect(theme).toBeInTheDocument();

      userEvent.click(theme);
      expect(theme).toHaveTextContent(to);

      userEvent.click(theme);
      expect(theme).toHaveTextContent(to);
    });
  });

  describe.each<{ from: ThemeName; to: ThemeName }>([
    { from: 'dark', to: 'light' },
    { from: 'light', to: 'dark' },
  ])('switchTheme', ({ from, to }) => {
    it(`${from} => ${to} => ${from}`, () => {
      customRender(
        <ThemeConsumer>
          {value => {
            if (!value) return <>Loading</>;
            const { currentTheme, switchTheme } = value;
            return <div onClick={() => switchTheme()}>{currentTheme}</div>;
          }}
        </ThemeConsumer>,
        from
      );

      const theme = screen.getByText(from);
      expect(theme).toBeInTheDocument();

      userEvent.click(theme);
      expect(theme).toHaveTextContent(to);

      userEvent.click(theme);
      expect(theme).toHaveTextContent(from);
    });
  });
});
