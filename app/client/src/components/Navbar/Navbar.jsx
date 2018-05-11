
import './Navbar.css';
import React, { Component } from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Main extends Component {

   constructor(props) {
      super(props);
   }

   logout() {
      console.log(this.props);
      this.props.logout(() => this.props.history.push('/login'));
   }
   
   renderNotLoggedIn() {
      return (
         <nav className="navbar">
            <Link to={'/login'}>
               <div>Login</div>
            </Link>
         </nav>
      );
   }
   
   renderLoggedIn() {
      let loggedInDisplayName = 
         <div>{this.props.User.info.username} &nbsp;
            <a href="" onClick={() => this.logout()}>
               Logout
            </a>
         </div>;
         
      return (
         <nav className="navbar">
            <Link to={'/home'}>
               <div>Home</div>
            </Link>

            <Link to={'/courses'}>
               <div>Courses</div>
            </Link>

            <Link to={'/help'}>
               <div>Help</div>
            </Link>

            <Link to={'/settings'}>
               <div>Settings</div>
            </Link>

            <Link to={'/about'}>
               <div>About</div>
            </Link>
            {loggedInDisplayName}
         </nav>
      );
   }
   
   renderNavbar() {
      if (this.props.User.isLoggedIn)
         return this.renderLoggedIn();
      else
         return this.renderNotLoggedIn();
   }

   render() {
      return (
         <div>{this.renderNavbar()}</div>
      )
   }
}

export default Main

