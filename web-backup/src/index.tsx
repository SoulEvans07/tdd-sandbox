import React from 'react';
import ReactDOM from 'react-dom';
import './root.scss';
import { HomeScreen } from './HomeScreen/HomeScreen';

ReactDOM.render(
  <React.StrictMode>
    <HomeScreen />
  </React.StrictMode>,
  document.getElementById('root')
);
