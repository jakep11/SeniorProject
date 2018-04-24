
import { push } from 'react-router-redux';
import { signIn, modifyUser } from "../api";


/* Actions */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const UPDATE = 'UPDATE';


/* Reducer */
export default function User(state = { isLoggedIn: false }, action) {
   switch(action.type) {
      case LOGIN:
         return {
            isLoggedIn: true,
            username: action.username,
            userId: action.userId
         };
      case LOGOUT:
         return {
            isLoggedIn: false
         };

      default:
         return state;
   }
}


/* Action Creators */
export const login = (credentials, cb) => {
   return (dispatch, prevState) => {
      signIn(credentials)
         .then((userInfo) => {
            dispatch({ username: userInfo.email, userId: userInfo.id, type: LOGIN });
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
      modifyUser(userId, body)
         .then((userInfo) => {
            dispatch({ username: userInfo.email, userId: userInfo.id, type: UPDATE });
         })
   }
};

export const actionCreators = { login, logout, updateUser };

