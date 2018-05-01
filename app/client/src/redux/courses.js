import * as api from '../api';

/* Actions */
const UPDATE_FILTER = 'UPDATE_FILTER';
const SET_SECTIONS = 'SET_SECTIONS';


const initialState = {
   sections: [],
   filter: {
      cpe: false,
      csc: true,
      ee: true
   }
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
      api.getSections()
         .then((sections) => {
            console.log('SECTIONS: ', sections);
            let sects = sections.map((s) => formatCourse(s));
            console.log('SECTS:', sects)
            dispatch({ type: SET_SECTIONS, sections: sects })
         })
   };
};

export const actionCreators = { updateFilter, updateSections };


/* Helper Functions */
function formatCourse(c) {
   return {
      ...c,
      dept: c.name.replace(/[0-9]/g, '') /* Remove numbers */
   }

}
