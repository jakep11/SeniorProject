
import './Navbar.css';
import React, { Component } from 'react';
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

            <a onClick={() => this.logout()}><div>Logout</div></a>
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

