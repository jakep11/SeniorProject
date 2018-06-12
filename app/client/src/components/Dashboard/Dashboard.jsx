import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import './Dashboard.css';

export default class Dashboard extends Component {
   constructor(props) {
      super(props);
      
      console.log(this.props.User);
   }
   
   render() {
      return(
         <div className="dashboard-wrapper">
            <h1>Dashboard</h1>
         </div>
      )
   }
}
