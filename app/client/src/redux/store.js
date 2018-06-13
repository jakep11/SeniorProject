import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
// import the root reducer
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './root';
import { routerMiddleware } from 'react-router-redux';

export const history = createBrowserHistory();
const historyMiddleware = routerMiddleware(history);


const defaultState = {};

const persistMiddleware = persistState();

const store = createStore(
   rootReducer,
   defaultState,
   composeWithDevTools(applyMiddleware(thunk, historyMiddleware), persistMiddleware)
);

if (module.hot) {
   module.hot.accept('./root',() => {
      const nextRootReducer = require('./root').default;
      store.replaceReducer(nextRootReducer);
   });
}

export default store;
