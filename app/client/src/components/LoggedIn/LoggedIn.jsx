
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';

export default class LoggedIn extends Component {
   constructor(props) {
      super(props);
      console.log(this.props);
      if (!this.props.User.isLoggedIn) {
         console.log('User is not logged in; sending to /login')
         this.props.history.push("/login")
      }

   }

   render() {
      return (
         <div>
            <Navbar {...this.props} />

            <Switch>
               <Route exact path="/home" component={Home} />
            </Switch>

         </div>

      )

   }
}
