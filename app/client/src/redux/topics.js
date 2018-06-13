import * as api from '../api';

/* Actions */
const ADD_TOPICS = 'ADD_TOPICS';
const ADD_TOPICS_DOCUMENTS = 'ADD_TOPICS_DOCUMENTS';
const ADD_TOPICS_EXERCISES = 'ADD_TOPICS_EXERCISES';
const ADD_TOPICS_VIDEOS = 'ADD_TOPICS_VIDEOS';
//const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
const TOGGLE_ACTIVITY = 'TOGGLE_ACTIVITY';
const MODIFY_TOPIC = 'MODIFY_TOPIC';

const initialState = {
   topics: {
      byId: {},
      allIds: []
   }
};

/* Reducer */
export default function Topics(state = initialState, action) {
   switch(action.type) { 

   case ADD_TOPICS:
      let clone = Object.assign({}, state);

      action.topics.forEach(topic => {
         const topicId = topic.id;
         clone.topics.byId[topicId] = topic;
         clone.topics.allIds.push(topicId);

         topic.activities = {
            exercises: [],
            documents: [],
            videos: []
         }
      });
      console.log("Clone is..", clone);
      return clone;

   case ADD_TOPICS_DOCUMENTS:
      clone = Object.assign({}, state);

      action.documents.forEach(document => {
         let topicId = document.topicId;
         clone.topics.byId[topicId].activities.documents.push(document);
      });
      return clone;

   case ADD_TOPICS_EXERCISES:
      clone = Object.assign({}, state);

      action.exercises.forEach(exercise => {
         let topicId = exercise.topicId;
         clone.topics.byId[topicId].activities.exercises.push(exercise);
      });
      return clone;

   case ADD_TOPICS_VIDEOS:
      clone = Object.assign({}, state);

      action.videos.forEach(video => {
         let topicId = video.topicId;
         clone.topics.byId[topicId].activities.videos.push(video);
      });
      return clone;

   case TOGGLE_ACTIVITY:
      return {
         
      }
   case MODIFY_TOPIC:
      return action.name;

   default:
      return state;
   }
}


/* Action Creators */
// export function addActivities(sectionId, cb) {
//    return (dispatch, prevState) => {
//       api.getActivities(topicId)
//          .then((topicActivities) => {
//             dispatch({
//                type: ADD_ACTIVITIES,
//                activities: topicActivities,
//                topicId: topicId
//             });
//          })
//          .then(() => { if (cb) cb(); })
//          .catch(error => {
//             console.log('Add activities error: ' + error);
//             //dispatch({type: 'CNVS_ERR', details: error});
//          });
//    };
// }

export function addTopicsAndActivities(sectionId, cb) {
   addTopics(sectionId,
      addDocuments(sectionId,
         addExercises(sectionId,
            addVideos(sectionId)
         )
      )
   );
}

export function addDocuments(sectionId, cb) {
   return (dispatch, prevState) => {
      api.getDocuments(sectionId)
         .then((documents) => {
            dispatch({
               type: ADD_TOPICS_DOCUMENTS,
               documents: documents
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add documents error: ' + error);
            //dispatch({type: 'CNVS_ERR', details: error});
         });
   };
}

export function addExercises(sectionId, cb) {
   return (dispatch, prevState) => {
      api.getExercises(sectionId)
         .then((exercises) => {
            dispatch({
               type: ADD_TOPICS_EXERCISES,
               exercises: exercises
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add exercises error: ' + error);
            //dispatch({type: 'CNVS_ERR', details: error});
         });
   };
}

export function addVideos(sectionId, cb) {
   return (dispatch, prevState) => {
      api.getVideos(sectionId)
         .then((videos) => {
            dispatch({
               type: ADD_TOPICS_VIDEOS,
               videos: videos
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add videos error: ' + error);
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
               topics: topics
            });
         })
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log('Add topics error: ' + error);
            //dispatch({type: 'CNVS_ERR', details: error});
         });
   };
}

export function modifyTopic(topicId, newName, cb) {
   return (dispatch, prevState) => {
      api.modifyTopic(topicId, {name : newName})
         .then(() => { if (cb) cb(); })
         .catch(error => {
            console.log("Modify topic error: " + error)
         });
   };
}

export function toggleActivity() {

}

export const actionCreators = {
   addTopics,
   addTopicsAndActivities,
   addDocuments,
   addExercises,
   addVideos,
   toggleActivity,
   modifyTopic
};
