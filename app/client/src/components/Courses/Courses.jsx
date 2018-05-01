
import React, { Component } from 'react';
import {Checkbox, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import CourseBlock from "../CourseBlock/CourseBlock";
import Sydebar from "../Sidebar/Sidebar";
import './Courses.css';
import { Link } from "react-router-dom";
import CoursesFilterSidebar from "../CoursesFilterSidebar/CoursesFilterSidebar";

export default class Courses extends Component {
   constructor(props) {
      super(props);

      this.props.updateSections();

      console.log('xyz:', this.props);
      this.handleChange = this.handleChange.bind(this);
   }
   
   handleChange(ev) {
      let newState = {};
      switch (ev.target.type) {
         case 'checkbox':
            newState[ev.target.id] = ev.target.checked;
            break;
         default:
            newState[ev.target.id] = ev.target.value;
      }
      console.log("New state of", ev.target.id,":", newState[ev.target.id]);
      this.setState(newState);
   }

   renderCourse(course, idx) {
      console.log('render: ', this);
      return (
         <Link key={course.id} to={`/courses/${course.id}`}>
            <CourseBlock title={course.name}
                         progress={0}
                         showProgress={true}
                         term={course.term}
                         isEnrolled={true} />
         </Link>
      )

   }

   render() {
      let filter = this.props.Courses.filter;
      let depts = Object
         .entries(filter)                  /* Get list of key-value pairs */
         .filter((kv) => kv[1] === true)   /* Filter only those with true value */
         .map((kv) => kv[0].toLowerCase())               /* Get just the dept names */
      let courses = this.props.Courses.sections.filter((c) => {
         console.log('depts', depts);
         console.log('depts[c.dept.toLowerCase()]', depts[c.dept.toLowerCase()]);
         console.log('c.dept.toLowerCase()', c.dept.toLowerCase());
         if (depts.length > 0) {
            if (depts.indexOf(c.dept.toLowerCase()) === -1)
               return false;
            else
               return true;
         }
         else {
            return true;
         }
      });
      return (
         <div className="cs-wrapper">
            <div className="cs-sidebar-container">
               <CoursesFilterSidebar {...this.props} />
            </div>
            <div className="cs-main">
               
               <div className="cs-header">
                  <input type="text" placeholder="Search Classes..." id='filter' onChange={this.handleChange}/>
               </div>


               {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" isEnrolled={true} />*/}
               {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" />*/}

               {
                  courses.map((c, idx) => this.renderCourse(c, idx))
               }

               {/*<Link to={'/courses/1'}>*/}
                  {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" isEnrolled={true} />*/}
               {/*</Link>*/}

               {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" />*/}
            </div>
         </div>
      )

   }
}
