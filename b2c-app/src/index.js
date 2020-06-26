//polyfills to support IE9+
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

//styles
import './index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

//fix for error in console "Warning: Expected server HTML to contain a matching <div> in <div>."
const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
renderMethod(
  //NOTE: if this is edited, then server.js needs to be updated too --> html = ReactDOMServer.renderToString(...)
  <BrowserRouter basename="/b2c">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
