import React from 'react';
import ReactDOM from 'react-dom';
import './root.scss';
import SignupScreen from './pages/SignupScreen/SignupScreen';
import { ThemeProvider } from './contexts/Theme';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider default="dark">
      <ThemeSetter>
        <SignupScreen />
      </ThemeSetter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
