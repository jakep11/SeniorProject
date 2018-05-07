import * as api from '../api';

/* Actions */
const ADD_TOPICS = 'ADD_TOPICS';
const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
const TOGGLE_ACTIVITY = 'TOGGLE_ACTIVITY';

const initialState = {
   topics: {
      byId: {
         1: {
            id: 1,
            // more stuff
            activities : {
               documents: [], // contains list of documentIds [1, 2, 3]
               exercises: [],
               videos: []
            }
         },
         2: {
            // topic 2 object
         }
      },
      allIds: [1, 2]
   },

   videos: {
      byId: {
         1: {
            expanded: true,
            // rest of exercise object
         }
      },
      allIds: [1]
   },

   exercises: {
      byId: {
         1: {
            expanded: true,
            // rest of exercise object
         }
      },
      allIds: [1]
   },

   documents: {
      byId: {
         1: {
            expanded: true,
            // rest of exercise object
         }
      },
      allIds: [1]
   },
};

/* Reducer */
export default function Topics(state = initialState, action) {
   switch(action.type) { 

   case ADD_ACTIVITIES:
      return {
         isLoggedIn: true,
         username: action.username,
         userId: action.userId
      };
   case ADD_TOPICS:
      return {
         isLoggedIn: false
      };

   case TOGGLE_ACTIVITY:
      return {
         
      }

   default:
      return state;
   }
}

/* Action Creators */
export function addActivities(topicId, cb) {
   return (dispatch, prevState) => {
      api.getActivities(topicId)
         .then((topicActivities) => {
            dispatch({
               type: ADD_ACTIVITIES,
               activities: topicActivities,
               topicId: topicId
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add activities error: ' + error);
            //dispatch({type: 'CNVS_ERR', details: error});
         });
   };
}

export function addTopics(sectionId, cb) {
   return (dispatch, prevState) => {
      api.getTopics(sectionId)
         .then((topics) => {
            dispatch({
               type: ADD_TOPICS,
               topics: topics,
               sectionId: sectionId
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add topics error: ' + error);
            //dispatch({type: 'CNVS_ERR', details: error});
         });
   };
}

export function toggleActivity() {

}

export const actionCreators = { addActivities, addTopics, toggleActivity };