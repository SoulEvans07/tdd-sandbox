import React from 'react';
import ReactDOM from 'react-dom';
import './root.scss';
import RegisterScreen from './RegisterScreen/RegisterScreen';
import { ThemeProvider } from './contexts/Theme';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider default="dark">
      <ThemeSetter>
        <RegisterScreen />
      </ThemeSetter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
