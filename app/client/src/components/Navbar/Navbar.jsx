
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

   render() {
      let loggedInDisplayName = 
         <div>{this.props.User.username} &nbsp;
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
      )
   }
}

export default Main

