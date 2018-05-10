
import { push } from 'react-router-redux';
import * as api from '../api';


/* Actions */
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const UPDATE = 'UPDATE';
export const UPDATE_ENROLLED = 'UPDATE_ENROLLED';


let defaultState = {
   isLoggedIn: false,
};

/* Reducer */
export default function User(state = defaultState, action) {
   switch(action.type) {
      case LOGIN:
         return {
            isLoggedIn: true,
            info: action.info,
            // username: action.username,
            // userId: action.userId
         };
      case LOGOUT:
         return {
            isLoggedIn: false,
            info: null
            // username: null,
            // userId: null,
         };

      case UPDATE_ENROLLED:
         return {
            ...state,
            enrolled:

         };

      default:
         return state;
   }
}


/* Action Creators */
export const login = (credentials, cb) => {
   return (dispatch, prevState) => {
      api.signIn(credentials)
         .then((userInfo) => {
            dispatch({ info: userInfo, type: LOGIN });
            cb();
         })
   };
};

export const logout = (cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: LOGOUT });
      cb();
   }
};

export const updateUser = (userId, body, cb) => {
   return (dispatch, prevState) => {
      api.modifyUser(userId, body)
         .then((userInfo) => {
            dispatch({ info: userInfo, type: UPDATE });
         })
   }
};

export const updateEnrolled = (userId, body, cb) => {
   return (dispatch, prevState) => {
      let userId = prevState.info.id;

      api.getEnrollment({userId})
         .then((enrollment) => {
            console.log('enrollment:', enrollment);
            dispatch({enrolled: enrollment, type: UPDATE_ENROLLED});
         })
   }
};

export const actionCreators = { login, logout, updateUser, updateEnrolled };

