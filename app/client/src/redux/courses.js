import * as api from '../api';

/* Actions */
const UPDATE_FILTER = 'UPDATE_FILTER';
const SET_SECTIONS = 'SET_SECTIONS';
const SEARCH = 'SEARCH';
const CLEAR_SEARCH = 'CLEAR_SEARCH';
const SET_SORT_ORDER = 'SET_SORT_ORDER';
const SET_SHOW_PROGRESS = 'SET_SHOW_PROGRESS';
const SET_ENROLLED_ONLY = 'SET_ENROLLED_ONLY';


const initialState = {
   sections: [],
   filter: {
      cpe: false,
      csc: true,
      ee: true,
   },
   showProgress: true,
   onlyEnrolled: true,
   searchQuery: '',
   sortOrder: 'ASC'
};

/* Reducer */
export default function Courses(state = initialState, action) {
   switch(action.type) {

      case UPDATE_FILTER:
         return {
            ...state,
            filter: { ...state.filter, ...action.filter }
         };

      case SET_SECTIONS:
         return {
            ...state,
            sections: action.sections
         };

      case SEARCH:
         return {
            ...state,
            searchQuery: action.searchQuery
         };

      case CLEAR_SEARCH:
         return {
            ...state,
            searchQuery: ''
         };

      case SET_SORT_ORDER:
         return {
            ...state,
            sortOrder: action.order
         };

      case SET_ENROLLED_ONLY:
         return {
            ...state,
            onlyEnrolled: action.enrolledOnly
         };

      case SET_SHOW_PROGRESS:
         return {
            ...state,
            showProgress: action.showProgress
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
