import * as api from '../api';

/* Actions */
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';


const initialState = {
   message: '',
};

/* Reducer */
export default function Error(state = initialState, action) {
   switch(action.type) {

      case SET_ERROR:
         return {
            message: action.message
         };

      case CLEAR_ERROR:
         console.log("Clearing errors");
         return {
            message: ''
         };

      default:
         return state;
   }
}


/* Action Creators */
export const setError = (message, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: SET_ERROR, message });
      cb && cb();
   };
};

export const clearError = (cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: CLEAR_ERROR });
      cb && cb();
   };
};

export const actionCreators = { setError, clearError };



