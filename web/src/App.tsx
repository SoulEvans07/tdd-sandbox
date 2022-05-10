import { ReactElement } from 'react';
import './root.scss';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';
import { Router } from './router/Router';

export default function App(): ReactElement {
  return (
    <ThemeProvider default="dark">
      <ThemeSetter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ThemeSetter>
    </ThemeProvider>
  );
}
