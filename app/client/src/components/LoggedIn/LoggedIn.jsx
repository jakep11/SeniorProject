
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';
import Home from '../Home/Home';
import Courses from '../Courses/Courses';
import Navbar from '../Navbar/Navbar';
import Settings from '../Settings/Settings';
import About from '../About/About';
import NotFound from '../NotFound/NotFound';
import './LoggedIn.css';
import CourseDetail from "../CourseDetail/CourseDetail";
import ConfDialog from '../ConfDialog/ConfDialog';

export default class LoggedIn extends Component {
   constructor(props) {
      super(props);
      console.log(this.props);
   }

   render() {

      if (!this.props.User.isLoggedIn) {
         console.log('User is not logged in; sending to /login');
         this.props.history.push("/login")
         return null;
      }

      return (
         <div className="page-wrapper">
            <Navbar {...this.props} />

            <Switch>
               <Route exact path="/home" render={() => <Home {...this.props} />} />
               {/*<Route exact path="/courses" component={Courses} />*/}
               <Route exact path="/courses" render={() => <Courses {...this.props} />} />
               <Route path="/courses/:courseId" render={() => <CourseDetail {...this.props} />} />
               <Route exact path="/settings" render={() => <Settings {...this.props} />}/>
               <Route exact path="/about" component={About} />
               <Redirect exact from="/" to="/home" />
               <Route path="*" component={NotFound} />
            </Switch>
            
            <ConfDialog
               show={this.props.Error.message !== ''}
               title="Notice"
               body={
                  <ListGroup>
                     <ListGroupItem bsStyle={this.props.Error.style}>
                        {this.props.Error.message}
                     </ListGroupItem>
                  </ListGroup>}
               button='OK'
               onClose={() => {this.props.clearError()}}
            />
         </div>

      )

   }
}
