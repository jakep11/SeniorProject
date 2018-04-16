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
