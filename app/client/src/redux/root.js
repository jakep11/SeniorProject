
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import User from './users';

export const rootReducer = combineReducers({ User, router: routerReducer });




