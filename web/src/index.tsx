import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './root.scss';
import { ThemeProvider } from './contexts/Theme';
import { ThemeSetter } from './containers/ThemeSetter/ThemeSetter';
import { Router } from './pages/Router';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider default="dark">
      <ThemeSetter>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeSetter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
