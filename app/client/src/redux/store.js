import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
// import { syncHistoryWithStore} from 'react-router-redux';
import { createBrowserHistory } from 'history';
// import the root reducer
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootEpic, rootReducer } from './root';
import { routerMiddleware } from 'react-router-redux';
// import { rootEpic } from '../epics/index';
// import rootReducer from '../reducers/index';


export const history = createBrowserHistory();
const historyMiddleware = routerMiddleware(history);

const epicMiddleware = createEpicMiddleware(rootEpic);

const defaultState = {};

const persistMiddleware = persistState();

const store = createStore(
   rootReducer,
   defaultState,
   composeWithDevTools(applyMiddleware(thunk, epicMiddleware, historyMiddleware), persistMiddleware)
);

if (module.hot) {
   module.hot.accept('./root',() => {
      const nextRootReducer = require('./root').default;
      store.replaceReducer(nextRootReducer);
   });
}

export default store;
