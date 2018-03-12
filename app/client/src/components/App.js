
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main/Main';
import React from 'react';
import Login from './Login/Login'
import LoggedIn from './LoggedIn/LoggedIn'

// These are the properties we'll automatically pass to Main
function mapStateToProps(state) {
   return {
      User: state.User,
   };
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators(actionCreators, dispatch);
}

const App = withRouter(connect(
   mapStateToProps,
   mapDispatchToProps
)(AppComponent));

function AppComponent(props) {
   console.log('props:',props);
   return (
      <Switch>
         <Route exact path="/login" render={() => <Login {...props} />} />
         <Route path="" render={() => <LoggedIn {...props} />} />
         <Redirect from="*" to="/login" />
      </Switch>
   )
}

export default App;
