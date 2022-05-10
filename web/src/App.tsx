import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './root.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';
import { Router } from './router/Router';

export default function App(): ReactElement {
  return (
    <ThemeProvider default="dark">
      <ThemeSetter>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeSetter>
    </ThemeProvider>
  );
}
