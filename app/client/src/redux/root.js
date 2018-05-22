
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import User from './users';
import Courses from './courses';
import Topics from './topics';
import Error from './error';

export const rootReducer = combineReducers({
   User,
   Courses,
   Topics,
   Error,
   router: routerReducer
});




