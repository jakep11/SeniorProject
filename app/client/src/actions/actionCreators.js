
export function signIn(username, cb) {
   console.log("signIn action creator");
   return (dispatch, prevState) => {
      dispatch({ type: "SIGN_IN", username })
   };
}
