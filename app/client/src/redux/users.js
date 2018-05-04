
import { push } from 'react-router-redux';
import { signIn } from "../api";


/* Actions */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';


/* Reducer */
export default function User(state = { isLoggedIn: false }, action) {
   switch(action.type) {
      case LOGIN:
         return {
            isLoggedIn: true,
            username: action.username
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
            dispatch({ username: userInfo.email, type: LOGIN });
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

export const actionCreators = { login, logout };

