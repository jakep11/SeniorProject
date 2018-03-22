
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { routerReducer } from 'react-router-redux';
import User, { epics as userEpics } from './users';

export const rootReducer = combineReducers({ User, router: routerReducer });

export const rootEpic = combineEpics(...userEpics);



