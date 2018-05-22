
import { push } from 'react-router-redux';
import * as api from '../api';


/* Actions */
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const UPDATE = 'UPDATE';
export const UPDATE_ENROLLED = 'UPDATE_ENROLLED';
export const ENROLL_IN_COURSE = 'ENROLL_IN_COURSE';
export const UNENROLL_IN_COURSE = 'UNENROLL_IN_COURSE';


let defaultState = {
   isLoggedIn: false,
   info: null
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
            enrolled: action.enrolled
         };

      case ENROLL_IN_COURSE:
         return {
            ...state,
            enrolled: [ ...state.enrolled, action.newCourseId ]
         };

      case UNENROLL_IN_COURSE:
         return {
            ...state,
            enrolled: state.enrolled.filter((cid) => cid === action.courseId)
         };

      default:
         return state;
   }
}


/* Action Creators */
export const login = (credentials, cb) => {
   console.log('login')
   return (dispatch, prevState) => {
      api.signIn(credentials)
         .then((userInfo) => {
            console.log('Login x')
            dispatch({ info: userInfo, type: LOGIN });
            cb();
         });
   };
};

export const logout = (cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: LOGOUT });
      cb();
   };
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
      let state = prevState();
      let userId = state.User.info.id;

      api.getEnrollment(userId, null)
         .then((enrollment) => {
            console.log('enrollment:', enrollment);
            let sectionIds = enrollment.map((e) => e.sectionId);
            console.log('sectionIds: ', sectionIds);
            // enrollment = [ 2, 3, 5 ];
            dispatch({enrolled: sectionIds, type: UPDATE_ENROLLED});
         })
   }
};

export const enrollInCourse = (courseId, cb) => {
   return (dispatch, prevState) => {
      let userId = prevState().User.info.id;
      let body = { userId, sectionId: courseId};
      console.log('enrollInCourse body: ', body);
      api.createEnrollment(body)
         .then(() => dispatch({ type: ENROLL_IN_COURSE, newCourseId: courseId }));
   }
}

export const unenrollInCourse = (courseId, cb) => {
   return (dispatch, prevState) => {
      console.log('prevStatE: ', prevState);
      // api.createEnrollment({ userId: prevState. })
   }
}



export const actionCreators = { login, logout, updateUser, updateEnrolled, enrollInCourse, unenrollInCourse };

