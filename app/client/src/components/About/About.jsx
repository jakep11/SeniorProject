
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';
import './About.css';

export default class About extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <Navbar {...this.props} />
            <div className="help-wrapper">
               <h1>About PolyEducate</h1>
               <div>
                  This application is built as a senior project by 6 Cal Poly students.
                  The goal of the application is to provide an online learning platform that 
                  is customizable for teachers to use.
               </div>
               <div>
                  If you find an issue with the application, please report it&nbsp;
                  <a target="_blank" href="https://github.com/jakep11/SeniorProject/issues/new">
                     here
                  </a>. 
               </div>
               
               
               {/*<Panel>
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
               </Panel>*/}
            </div>
         </div>
      )
   }
}
