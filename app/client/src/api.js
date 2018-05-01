const baseURL = 'http://localhost:4000/';
const headers = new Headers();
var cookie;

headers.set('Content-Type', 'application/json');

const reqConf = {
   headers: headers,
   credentials: 'include',
};

function safeFetch(...params) {
   return fetch(...params)
      .then((res) => {
         return res.ok ? res : res.json().then((body) => Promise.reject(body))
      })
      .catch((err) => {
         if (err.toString() === 'TypeError: Failed to fetch')
            return Promise.reject(['Server Connect Error']);
         else {
            console.log('err:', err);
            let msgs = err.map((e) => errorTranslate(e.tag));
            console.log('errMsgs:', msgs);
            return Promise.reject(err.map(e => errorTranslate(e.tag)));
         }
      })
}


// Helper functions for the common request types

/**
 * make a post request
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise}
 */
export function post(endpoint, body) {
   return safeFetch(baseURL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...reqConf
   });
}

/**
 * make a put request
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise}
 */
export function put(endpoint, body) {
   return safeFetch(baseURL + endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...reqConf
   })
}

/**
 * make a get request
 * @param {string} endpoint
 * @returns {Promise}
 */
export function get(endpoint) {
   return safeFetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   })
}

export function del(endpoint) {
   return safeFetch(baseURL + endpoint, {
      method: 'DELETE',
      ...reqConf
   })
}

// Functions for performing the api requests

/**
 * Sign a user into the service, returns the user data
 * @param {{user: string, password: string}} cred
 */
export function signIn(cred) {
   console.log("API signin with ", cred);
   return post("Session", cred)
      .then((response) => {
         if (response.ok) {
            let location = response.headers.get("Location").split('/');
            cookie = location[location.length - 1];
            return get("Session/" + cookie)
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json())
      .then(rsp => get('User/' + rsp.userId))
      .then(userResponse => userResponse.json())
      .then(rsp => rsp[0]);
}

// Handle response with non-200 status by returning a Promise that rejects,
// with reason: array of one or more error strings suitable for display.
function createErrorPromise(response) {
   console.log('create error promise')
   if (response.status === 400 || response.status === 401
    || response.status === 402 || response.status === 403) {
      return Promise.resolve(response)
         .then(response => response.json())
         .then(errorList => {
            Promise.reject(errorList.length
            ? errorList.map(err => errorTranslate(err.tag))
            : ["Unknown error"])});
   }
   else
      return Promise.reject(["Unknown error"]);
}

/**
 * @returns {Promise} result of the sign out request
 */
export function signOut() {
   return del("Session/" + cookie);
}

/**
 * Register a user
 * @param {Object} user
 * @returns {Promise}
 */
export function register(user) {
   return post("User/", user)
      .then(res => {
         return res.ok ? null : createErrorPromise(res);
      })
}

/**
 * Gets a section's topics
 * @param {Integer} sectionId    // optional argument
 * @returns {Promise}
 */
export function getTopics(sectionId) {
   let endpoint = 'Topic';

   if (sectionId) // add sectionId query if not null
      endpoint += `?sectionId=${sectionId}`;

   return get(endpoint)
      .then((res) => res.json());
}

/**
 * Creates a topic
 * @param {Object} body
 * @returns {Promise}
 */
export function createTopic(body) {
   return post('Topic', body)
      .then((response) => {
         if (response.ok) {
            const location = response.headers.get("Location").split('/');
            const topicId = location[location.length - 1];

            return get(`Topic/${topicId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json())
}

/**
 * Gets a topic
 * @param {Integer} topicId
 * @returns {Promise}
 */
export function getTopic(topicId) {
   return get(`Topic/${topicId}`)
      .then((res) => res.json());
}

/**
 * Modifies a topic
 * @param {Integer} topicId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyTopic(topicId, body) {
   return put(`Topic/${topicId}`, body)
      .then((response) => {
         if (response.ok) {
            return get(`Topic/${topicId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json());
}

/**
 * Deletes a topic
 * @param {Integer} topicId
 * @returns {Promise}
 */
export function deleteTopic(topicId) {
   return del(`Topic/${topicId}`)
      .then((response) => {
         if (response.ok) {
            return topicId;
         }
         else
            return createErrorPromise(response);
      });
}

/**
 * Gets a topic's activities
 * @param {Integer} topicId
 * @returns {Promise}
 */
export function getActivities(topicId) {
   return get(`Topic/${topicId}/Activities`)
      .then((res) => res.json());
}

/**
 * Gets exercises
 * @returns {Promise}
 */
export function getExercises() {
   return get('Exercise')
      .then((res) => res.json());
}

/**
 * Creates an exercise
 * @param {object} body
 * @returns {Promise}
 */
export function createExercise(body) {
   return post('Exercise', body)
      .then((response) => {
         if (response.ok) {
            const location = response.headers.get("Location").split('/');
            const exerciseId = location[location.length - 1];

            return get(`Exercise/${exerciseId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json())
}

/**
 * Gets an exercise
 * @param {Integer} exerciseId
 * @returns {Promise}
 */
export function getExercise(exerciseId) {
   return get(`Exercise/${exerciseId}`)
      .then((res) => res.json());
}

/**
 * Modifies an exercise
 * @param {Integer} exerciseId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyExercise(exerciseId, body) {

}

/**
 * Deletes an exercise
 * @param {Integer} exerciseId
 * @returns {Promise}
 */
export function deleteExercise(exerciseId) {

}

/**
 * Grades an exercise
 * @param {Integer} exerciseId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyExerciseGrade(exerciseId, body) {
   
}

/**
 * Gets videos
 * @returns {Promise}
 */
export function getVideos() {
   return get('Video')
      .then((res) => res.json());
}

/**
 * Creates a video
 * @param {object} body
 * @returns {Promise}
 */
export function createVideo(body) {
   return post('Video', body)
      .then((response) => {
         if (response.ok) {
            const location = response.headers.get("Location").split('/');
            const videoId = location[location.length - 1];

            return get(`Video/${videoId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json())
}

/**
 * Gets a video
 * @param {Integer} videoId
 * @returns {Promise}
 */
export function getVideo(videoId) {
   return get(`Video/${videoId}`)
      .then((res) => res.json());
}

/**
 * Modifies a video
 * @param {Integer} videoId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyVideo(videoId, body) {
   return put(`Video/${videoId}`, body)
      .then((response) => {
         if (response.ok) {
            return get(`Video/${videoId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json());
}

/**
 * Deletes a video
 * @param {Integer} videoId
 * @returns {Promise}
 */
export function deleteVideo(videoId) {
   return del(`Video/${videoId}`)
      .then((response) => {
         if (response.ok) {
            return videoId;
         }
         else
            return createErrorPromise(response);
      });
}

/**
 * Gets documents
 * @returns {Promise}
 */
export function getDocuments() {
   return get('Document')
      .then((res) => res.json());
}

/**
 * Creates a document
 * @param {object} body
 * @returns {Promise}
 */
export function createDocument(body) {
   return post('Document', body)
      .then((response) => {
         if (response.ok) {
            const location = response.headers.get("Location").split('/');
            const documentId = location[location.length - 1];

            return get(`Document/${documentId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json())
}

/**
 * Gets a document
 * @param {Integer} documentId
 * @returns {Promise}
 */
export function getDocument(documentId) {
   return get(`Document/${documentId}`)
      .then((res) => res.json());
}

/**
 * Modifies a document
 * @param {Integer} documentId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyDocument(documentId, body) {
   return put(`Document/${documentId}`, body)
      .then((response) => {
         if (response.ok) {
            return get(`Document/${documentId}`);
         }
         else
            return createErrorPromise(response);
      })
      .then(response => response.json());
}

/**
 * Deletes a document
 * @param {Integer} documentId
 * @returns {Promise}
 */
export function deleteDocument(documentId) {
   return del(`Document/${documentId}`)
      .then((response) => {
         if (response.ok) {
            return documentId;
         }
         else 
            return createErrorPromise(response);
      });
}

/**
 * Gets a section
 * @param {Integer} term   // optional argument
 * @param {Integer} name   // optional argument
 * @returns {Promise}
 */
export function getSections(term, name) {
   let endpoint = 'Section';

   /* add query paremeters if they exist */
   if (term || name) {     // check if queries exist
      endpoint += '?';
      addQueryArg(endpoint, 'term', term);
      addQueryArg(endpoint, 'name', name);
   }

   return get(endpoint)
      .then((res) => res.json());
}

/**
 * Creates a section
 * @param {Object} body
 * @returns {Promise}
 */
export function createSection(body) {
   return post('Section', body)
      .then((response) => {
         if (response.ok) {
            const location = response.headers.get("Location").split('/');
            const sectionId = location[location.length - 1];

            return get(`Section/${sectionId}`);
         }
         else {
            return createErrorPromise(response);
         }
      })
      .then(response => response.json())
}

/**
 * Gets a section
 * @param {Integer} sectionId
 * @returns {Promise}
 */
export function getSection(sectionId) {
   return get(`Section/${sectionId}`)
      .then((res) => res.json());
}

/**
 * Modifies a section
 * @param {Integer} sectionId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifySection(sectionId, body) {
   return put(`Section/${sectionId}`, body)
      .then((response) => {
         if (response.ok) {
            return get(`Section/${sectionId}`);
         }
         else {
            return createErrorPromise(response);
         }
      })
      .then(response => response.json());
}

/**
 * Deletes a section
 * @param {Integer} SectionId
 * @returns {Promise}
 */
export function deleteSection(sectionId) {
   return del(`Section/${sectionId}`)
      .then((response) => {
         if (response.ok) {
            return sectionId;
         }
         else {
            return createErrorPromise(response);
         }
      });
}

/**
 * Gets a user's progress
 * @param {Integer} userId
 * @returns {Promise}
 */
export function getUserProgress(userId) {
   return get(`Progress/${userId}`)
      .then((res) => res.json());
}

/**
 * Modifies a user's progress
 * @param {Integer} userId
 * @param {Object} body
 * @returns {Promise}
 */
export function modifyUserProgress(userId, body) {
   return put(`Progress/${userId}`, body)
      .then((response) => {
         if (response.ok) {
            return get(`Progress/${userId}`);
         }
         else {
            return createErrorPromise(response);
         }
      })
      .then(response => response.json());
}

const errMap = {
   en: {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).',
      cnnErr: 'Server Connect Error'
   }
};

/**
 * TODO perhaps should return a Promise to conform with the
 * rest of the api functions
 *
 * @param {string} errTag
 * @param {string} lang
 */
export function errorTranslate(errTag, lang = 'en') {
   console.log('errTag:', errTag)
   // console.log(errMap[lang][errTag])
   return errMap[lang][errTag] || 'Unknown Error!';
}

function addQueryArg(endpoint, query, arg) {
   const lastChar = endpoint[endpoint.length - 1];

   if (!arg)               // no argument exists
      return;

   if (lastChar !== '?')   // previous argument exists
      endpoint += '&';
      
   endpoint += `${query}=${arg}`;
}