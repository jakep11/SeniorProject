
export function login(username) {
   console.log("login action creator");
   return (dispatch, prevState) => {
      return Promise.resolve()
         .then(() => dispatch({ type: 'LOGIN', username }))

   };
}

export function logout() {
   return (dispatch, prevState) => {
      return Promise.resolve()
         .then(() => dispatch({ type: 'LOGOUT' }))

   };
}
