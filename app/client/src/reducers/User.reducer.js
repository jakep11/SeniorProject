
function User(state = { isLoggedIn: false }, action) {

   switch(action.type) {

      case 'SIGN_IN':
         return {
            isLoggedIn: true,
            username: action.username
         };

      case 'SIGN_OUT':
         return {
            isLoggedIn: false
         };

      default:
         return state;
   }
}

export default User;
