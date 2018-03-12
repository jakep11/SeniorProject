
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App.js';

import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css'; // Bootstrap
import './index.css'; // Our own main stylesheet

import store from './store';

const router = (
   <Provider store={store}>
      <BrowserRouter>
         <App/>
      </BrowserRouter>
   </Provider>
);

ReactDOM.render(router, document.getElementById('root'));
registerServiceWorker();
