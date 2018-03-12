
function User(state = { isLoggedIn: false }, action) {

   switch(action.type) {

      case 'LOGIN':
         return {
            isLoggedIn: true,
            username: action.username
         };

      case 'LOGOUT':
         return {
            isLoggedIn: false
         };

      default:
         return state;
   }
}

export default User;
