
import React, { Component } from 'react';
import {Checkbox, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import CourseBlock from "../CourseBlock/CourseBlock";
import Sydebar from "../Sidebar/Sidebar";
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
      
      this.handleChange = this.handleChange.bind(this);
   }
   
   handleChange(ev) {
      let newState = {};
      newState[ev.target.id] = ev.target.checked;
      this.setState(newState);
   }

   render() {
      return (
         <div className="cs-wrapper">
            <div className="cs-sidebar-container">
               <h2 className="cs-filter-header">Filter</h2>
               <div>
                  <div className="cs-filter-type">Date Order</div>
                  <FormGroup>
                     <Checkbox id='ascending' onChange={this.handleChange}> Ascending</Checkbox>
                     <Checkbox id='descending' onChange={this.handleChange}> Descending</Checkbox>
                  </FormGroup>

                  <div className="cs-filter-type">Department</div>
                  <FormGroup>
                     <Checkbox id='cpe' onChange={this.handleChange}> CPE</Checkbox>
                     <Checkbox id='csc' onChange={this.handleChange}> CSC</Checkbox>
                     <Checkbox id='ee' onChange={this.handleChange}> EE</Checkbox>
                  </FormGroup>
                  
                  <div className="cs-filter-type">Show</div>
                  <FormGroup>
                     <Checkbox id='progress' onChange={this.handleChange}> % Progress</Checkbox>
                     <Checkbox id='enrolled' onChange={this.handleChange}> Enrolled</Checkbox>
                  </FormGroup>
               </div>
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
