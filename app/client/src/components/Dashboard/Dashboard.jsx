import React, { Component } from 'react';
import * as api from "../../api";

import './Dashboard.css';

export default class Dashboard extends Component {
   constructor(props) {
      super(props);
      
      console.log(this.props.User);
      
      api.getUsers()
         .then(users => {
            console.log("All users:", users);
            let students = users.filter(user => user.role === 0);
            console.log("Students:", students);
            let progressMap = students.map(student => 
               api.getUserProgress(student.id)
                  .then(progress => progress)
            )
            return Promise.all(progressMap);
         })
         .then(progress => {
            console.log(progress);
            this.setState({ progress });
         })
     
      this.state = { progress: [] };
   }
   
   render() {
      return(
         <div className="dashboard-wrapper">
            <h1>Dashboard</h1>
         </div>
      )
   }
}
