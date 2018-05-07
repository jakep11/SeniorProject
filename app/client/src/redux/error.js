import * as api from '../api';

/* Actions */
const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';


const initialState = {
   message: '',
};

/* Reducer */
export default function Error(state = initialState, action) {
   switch(action.type) {

      case SET_ERROR:
         return {
            ...state,
            message: action.message
         };

      case CLEAR_ERROR:
         return {
            ...state,
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



