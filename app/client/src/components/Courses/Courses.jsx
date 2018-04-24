
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
      console.log("CHECKBOX:", ev.target);
      switch (ev.target.type) {
      case 'checkbox':
         if (ev.target.id === 'ascending') {
            newState.ascending = ev.target.checked ? 1 : 0;
         } else if (ev.target.id === 'descending') {
            newState.descending = ev.target.checked ? 1 : 0;
         }
         break;
      default:
         newState[ev.target.id] = ev.target.value;
      }
      this.setState(newState);
   }

   render() {
      return (
         <Sydebar {...this.props} 
            titleBar={<h2 className="cs-filter-header">Filter</h2>}
            content={
               <div className="cs-filter-wrapper">
                  <div className="cs-filter-type">Date Order</div>
                  <FormGroup>
                     <Checkbox id='ascending' onChange={this.handleChange}> Ascending</Checkbox>
                     <Checkbox id='descending' onChange={this.handleChange}> Descending</Checkbox>
                  </FormGroup>

                  <div className="cs-filter-type">Department</div>
                  <FormGroup>
                     <Checkbox> CPE</Checkbox>
                     <Checkbox> CSC</Checkbox>
                     <Checkbox> EE</Checkbox>
                  </FormGroup>
                  
                  <div className="cs-filter-type">Show</div>
                  <FormGroup>
                     <Checkbox> % Progress</Checkbox>
                     <Checkbox> Enrolled</Checkbox>
                  </FormGroup>
                  
               </div>
            }
            children={
               <div className="cs-wrapper">
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
            }/>
      )

   }
}
