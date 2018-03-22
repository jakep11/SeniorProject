
import Rx from 'rxjs/Rx';
import { push } from 'react-router-redux';

/* Actions */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';


/* Reducer */
export default function User(state = { isLoggedIn: false }, action) {
   switch(action.type) {
      case LOGIN_SUCCESS:
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
export const login = (credentials) => ({ type: LOGIN, credentials });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });
export const loginFailure = () => ({ type: LOGIN_FAILURE });
export const logout = () => ({ type: LOGOUT });


/* Epics */
export const loginEpic = (action$) =>
   action$.ofType(LOGIN)
      .do(() => console.log('try login'))
      .delay(1000)
      .do(() => console.log('delay complete'))
      .mapTo({ type: LOGIN_SUCCESS });

export const loginSuccessEpic = (action$) =>
   action$.ofType(LOGIN_SUCCESS)
      .do(() => console.log('loginSuccessEpic'))
      .map(() => push('/home'));

export const logoutEpic = (action$) =>
   action$.ofType(LOGOUT)
      .map(() => push('/login'));



export const actionCreators = { login, loginSuccess, loginFailure, logout };
export const epics = [ loginEpic, loginSuccessEpic, logoutEpic ];
