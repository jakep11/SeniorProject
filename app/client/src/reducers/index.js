import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';

import User from './User.reducer';

const rootReducer = combineReducers({User});

export default rootReducer;
