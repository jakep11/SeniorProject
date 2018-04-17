import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Navbar, Nav, NavItem, ListGroup, ListGroupItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Main extends Component {

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <h1>Hello World!</h1>
         </div>

      )
   }
}

export default Main
