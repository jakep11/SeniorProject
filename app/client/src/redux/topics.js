import * as api from '../api';

/* Actions */
const ADD_TOPICS = 'ADD_TOPICS';
const ADD_ACTIVITIES = 'ADD_ACTIVITIES';
const TOGGLE_ACTIVITY = 'TOGGLE_ACTIVITY';
const TOGGLE_DOCUMENT = 'TOGGLE_DOCUMENT';
const TOGGLE_EXERCISE = 'TOGGLE_EXERCISE';
const TOGGLE_VIDEO = 'TOGGLE_VIDEO';

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

         /* adding activities object to topic */
         topic.activities = {
            exercises: [],
            documents: [],
            videos: []
         }

         /* updating store by adding new topic */
         clone.topics.byId[topicId] = topic;
         clone.topics.allIds.push(topicId);
      });

      return clone;

   case ADD_TOPICS_DOCUMENTS:
      let clone = Object.assign({}, state);

      action.documents.forEach(document => {
         let topicId = document.topicId;

         /* adding properties to document */
         document.expanded = false;

         /* adding document to topic's document list */
         clone.topics.byId[topicId].activities.documents.push(document);
      });
      return clone;

   case ADD_TOPICS_EXERCISES:
      let clone = Object.assign({}, state);

      action.exercises.forEach(exercise => {
         let topicId = exercise.topicId;

         /* adding properties to exercise */
         exercise.expanded = false;

         /* adding exercise to topic's exercise list */
         clone.topics.byId[topicId].activities.exercises.push(exercise);
      });
      return clone;

   case ADD_TOPICS_VIDEOS:
      let clone = Object.assign({}, state);

      action.videos.forEach(video => {
         let topicId = video.topicId;

         /* adding properties to video */
         video.expanded = false;

         /* adding video to topic's video list */
         clone.topics.byId[topicId].activities.videos.push(video);
      });

      return clone;

   case TOGGLE_DOCUMENT:
      let clone = Object.assign({}, state);
      const topicId = action.topicId;
      const documentId = action.documentId;
      let documents = clone.topics.byId[topicId].activities.documents;

      clone.topics.byId[topicId].activities.documents = 
         documents.map((document) => {
            if (document.id === action.documentId) {
               return Object.assign({}, doc, {
                  expanded: !document.expanded
               });
            }
            return doc;
      });

      return clone;

   case TOGGLE_EXERCISE:
      let clone = Object.assign({}, state);
      const topicId = action.topicId;
      const exerciseId = action.exerciseId;
      let exercises = clone.topics.byId[topicId].activities.exercises;

      clone.topics.byId[topicId].activities.exercises = 
         exercises.map((exercise) => {
            if (exercise.id === action.exerciseId) {
               return Object.assign({}, doc, {
                  expanded: !exercise.expanded
               });
            }
            return exercise;
      });

      return clone;

   case TOGGLE_VIDEO:
      let clone = Object.assign({}, state);
      const topicId = action.topicId;
      const videoId = action.videoId;
      let videos = clone.topics.byId[topicId].activities.videos;

      clone.topics.byId[topicId].activities.videos = 
      videos.map((video) => {
            if (video.id === action.videoId) {
               return Object.assign({}, doc, {
                  expanded: !video.expanded
               });
            }
            return video;
      });

      return clone;

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

export function toggleExercise(exerciseId, topicId, cb) {
   return (dispatch, prevState) => {
      dispatch({
         type: TOGGLE_EXERCISE,
         exerciseId: exerciseId,
         topicId: topicId
      });
      if (cb) cb();
   }
}

export function toggleDocument(documentId, topicId, cb) {
   return (dispatch, prevState) => {
      dispatch({
         type: TOGGLE_DOCUMENT,
         documentId: documentId,
         topicId: topicId
      });
      if (cb) cb();
   }
}

export function toggleVideo(videoId, topicId, cb) {
   return (dispatch, prevState) => {
      dispatch({
         type: TOGGLE_DOCUMENT,
         videoId: videoId,
         topicId: topicId
      });
      if (cb) cb();
   }
}

export const actionCreators = {
   addTopics,
   addTopicsAndActivities,
   addDocuments,
   addExercises,
   addVideos,
   toggleExercise,
   toggleDocument,
   toggleVideo
};