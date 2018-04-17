
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

   render() {
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
      )
   }
}

export default Main

