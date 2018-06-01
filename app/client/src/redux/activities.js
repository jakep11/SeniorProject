import * as api from '../api';

/* Actions */
const SET_ACTIVITIES = 'SET_ACTIVITIES';


const initialState = {
   activities: [],
};

/* Reducer */
export default function Activities(state = initialState, action) {
   switch(action.type) {

      case ADD_ACTIVITIES:
         return {
            ...state,
            activities: action.activities
         };

      default:
         return state;
   }
}


/* Action Creators */
export const updateFilter = (filter, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: UPDATE_FILTER, filter });
   };
};

export const updateSections = (cb) => {
   return (dispatch, prevState) => {
      console.log('update sections')
      api.getSections()
         .then((sections) => {
            console.log('SECTIONS: ', sections);
            let sects = sections.map((s) => formatCourse(s));
            console.log('SECTS:', sects)
            dispatch({ type: SET_SECTIONS, sections: sects })
         })
   };
};

export const search = (query, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: SEARCH, searchQuery: query });
      cb && cb();
   };
};

export const clearSearch = (cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: CLEAR_SEARCH });
      cb && cb();
   };
};

export const setSortOrder = (order, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: SET_SORT_ORDER, order });
      cb && cb();
   };
};

export const setShowEnrolled = (enrolledOnly, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: SET_ENROLLED_ONLY, enrolledOnly });
      cb && cb();
   };
};

export const setShowProgress = (showProgress, cb) => {
   return (dispatch, prevState) => {
      dispatch({ type: SET_SHOW_PROGRESS, showProgress });
      cb && cb();
   };
};

export const actionCreators = {
   updateFilter,
   updateSections,
   search,
   clearSearch,
   setSortOrder,
   setShowEnrolled,
   setShowProgress
};


/* Helper Functions */
function formatCourse(c) {
   return {
      ...c,
      dept: c.name.replace(/[0-9]/g, '') /* Remove numbers */
   }

}
