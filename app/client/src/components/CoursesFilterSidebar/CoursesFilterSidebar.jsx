
import {Checkbox, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class CoursesFilterSidebar extends Component {

   constructor(props) {
      super(props);

      console.log('this.props:', this.props)
      this.state = {
         progress: 10
      };
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
      console.log('this:',this);
      this.setState(newState);
   }

   updateFilter(filterChanges) {
      let newFilter = Object.assign({}, this.props.Courses.filter, filterChanges);
      console.log('newFilter: ', newFilter);
      console.log('props: ', this.props);
      this.props.updateFilter(newFilter);

   }

   render() {
      return (
         <div className="cf-wrapper">
            <h2 className="cs-filter-header">Filter</h2>
            <div>
               <div className="cs-filter-type">Date Order</div>
               <FormGroup>
                  <Checkbox id='ascending' onChange={(ev) => this.handleChange(ev)}> Ascending</Checkbox>
                  <Checkbox id='descending' onChange={(ev) => this.handleChange(ev)}> Descending</Checkbox>
               </FormGroup>

               <div className="cs-filter-type">Department</div>
               <FormGroup>

                  <Checkbox id='ee'
                            checked={this.props.Courses.filter.ee == null ? false : this.props.Courses.filter.ee}
                            onChange={(e) => this.updateFilter({ [e.target.id]: !this.props.Courses.filter[e.target.id]})}> EE</Checkbox>

                  <Checkbox id='cpe'
                            checked={this.props.Courses.filter.cpe}
                            onChange={(e) => this.updateFilter({ [e.target.id]: !this.props.Courses.filter[e.target.id]})}> CPE</Checkbox>

                  <Checkbox id='csc'
                            checked={this.props.Courses.filter.csc}
                            onChange={(e) => this.updateFilter({ [e.target.id]: !this.props.Courses.filter[e.target.id]})}> CSC</Checkbox>

               </FormGroup>

               <div className="cs-filter-type">Show</div>
               <FormGroup>
                  <Checkbox id='progress'
                            value={this.props.Courses.filter.progress == null ? false : this.props.Courses.filter.progress}
                            onChange={(e) => this.updateFilter({ [e.target.id]: !this.props.Courses.filter[e.target.id]})}> % Progress</Checkbox>

                  <Checkbox id='enrolled'
                            value={this.props.Courses.filter.enrolled == null ? false : this.props.Courses.filter.enrolled }
                            onChange={(e) => this.updateFilter({ [e.target.id]: !this.props.Courses.filter[e.target.id]})}> Enrolled</Checkbox>

               </FormGroup>
            </div>

         </div>

      )

   }
}


