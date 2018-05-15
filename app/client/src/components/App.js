
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
// import * as actionCreators from '../actions/user-actions';
import { actionCreators as userActionCreators } from '../redux/users';
import { actionCreators as courseActionCreators } from '../redux/courses';
import { actionCreators as errorActionCreators } from '../redux/error';
import Main from './Main/Main';
import React from 'react';
import Login from './Login/Login'
import LoggedIn from './LoggedIn/LoggedIn'

// These are the properties we'll automatically pass to Main
function mapStateToProps(state) {
   return {
      User: state.User,
      Courses: state.Courses,
      Error: state.Error
   };
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators({...userActionCreators, ...courseActionCreators, ...errorActionCreators}, dispatch);
}

const App = withRouter(connect(
   mapStateToProps,
   mapDispatchToProps
)(AppComponent));

function AppComponent(props) {
   return (
      <Switch>
         <Route exact path="/login" render={() => <Login {...props} />} />
         <Route path="" render={() => <LoggedIn {...props} />} />
         <Redirect from="*" to="/login" />
      </Switch>
   )
}

export default App;
