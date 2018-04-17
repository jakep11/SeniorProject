
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux'
import { history } from './redux/store';


import App from './components/App.js';

import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css'; // Bootstrap
import './index.css'; // Our own main stylesheet

import Rx from 'rxjs/Rx';
import 'rxjs/add/observable/of';



import store from './redux/store';

const router = (
   <Provider store={store}>
      {/*<BrowserRouter>*/}
      <ConnectedRouter history={history}>
         <App/>
      </ConnectedRouter>
      {/*</BrowserRouter>*/}
   </Provider>
);

ReactDOM.render(router, document.getElementById('root'));
registerServiceWorker();
