
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import User from './users';
import Courses from './courses';
import Error from './error';

export const rootReducer = combineReducers({
   User,
   Courses,
   Error,
   router: routerReducer
});




