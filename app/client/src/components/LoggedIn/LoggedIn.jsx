
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';


export default class LoggedIn extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <Navbar />

            <Switch>
               <Route exact path="/home" component={Home} />
            </Switch>

         </div>

      )

   }
}
