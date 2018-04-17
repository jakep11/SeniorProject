
import React, { Component } from 'react';
import CourseBlock from "../CourseBlock/CourseBlock";
import './Courses.css';
import { Link } from "react-router-dom";

export default class Courses extends Component {
   constructor(props) {
      super(props);

      this.state = {
         progress: 10
      };

      let mult = 1;

      setInterval(() => {
         if (this.state.progress >= 100 || this.state.progress <= 0)
            mult *= -1;
         this.setState({ progress: this.state.progress + mult * 10});
      }, 320);
   }

   render() {
      return (
         <div className="cs-wrapper">
            <div className="cs-sidebar-container">
               sidebar here

            </div>
            <div className="cs-main">
               
               <div className="cs-header">
                  <input type="text" placeholder="Search Classes..."/>
               </div>
               
               <CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" isEnrolled={true} />
               <CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" />

               <Link to={'/courses/1'}>
                  <CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" isEnrolled={true} />
               </Link>

               <CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" />
            </div>
         </div>
      )

   }
}
