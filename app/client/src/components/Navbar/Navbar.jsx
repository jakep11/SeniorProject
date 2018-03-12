
import './Navbar.css';
import React, { Component } from 'react';

class Main extends Component {

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <nav className="navbar">
            <a><div>Home</div></a>
            <a><div>Courses</div></a>
            <a><div>Help</div></a>
            <a><div>Settings</div></a>
            <a><div>About</div></a>
         </nav>
      )
   }
}

export default Main

