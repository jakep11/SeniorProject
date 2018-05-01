
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

export default class About extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <h1>About</h1>
            <Panel>
               <Panel.Body>
               This application is built as a senior project by 6 Cal Poly students.
               The goal of the application is to provide an online learning platform that 
               is customizable for teachers to use.
               <br />
               If you find an issue with the application, please report it &nbsp;
               <a target="_blank" href="https://github.com/jakep11/SeniorProject/issues/new">
                  here
               </a>. 
               </Panel.Body>
            </Panel>
         </div>
      )
   }
}
