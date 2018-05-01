
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import User from './users';
import Courses from './courses';

export const rootReducer = combineReducers({
   User,
   Courses,
   router: routerReducer
});




