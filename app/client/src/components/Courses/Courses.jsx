
import React, { Component } from 'react';
import CourseBlock from "../CourseBlock/CourseBlock";
import './Courses.css';
import { Link } from "react-router-dom";
import CoursesFilterSidebar from "../CoursesFilterSidebar/CoursesFilterSidebar";

export default class Courses extends Component {
   constructor(props) {
      super(props);

      this.props.updateSections();

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
      this.setState(newState);
   }

   updateQuery(q) {
      q ? this.props.search(q) : this.props.clearSearch();
   }

   renderCourse(course, idx) {
      let isEnrolled = false;
      if (!this.props.User.info.role)
         isEnrolled = this.props.User.enrolled.find((id) => id === course.id) == null;

      console.log('isEnrolled: ', isEnrolled);

      return (
         <Link key={course.id} to={`/courses/${course.id}`} className='cs-course-link'>
            <CourseBlock course={course}
                         progress={0}
                         showProgress={this.props.Courses.showProgress && !isEnrolled}
                         showEnroll={isEnrolled}
                         term={course.term}
                         isEnrolled={true}
                         {...this.props} />
         </Link>
      )

   }

   // renderCourse(course, idx) {
   //    return (
   //       <Link key={course.id} to={`/courses/${course.id}`} className='cs-course-link'>
   //          <CourseBlock course={course}
   //                       progress={0}
   //                       showProgress={this.props.Courses.showProgress}
   //                       showEnroll={false}
   //                       term={course.term}
   //                       isEnrolled={true} />
   //       </Link>
   //    )
   //
   // }

   render() {
      let filter = this.props.Courses.filter;
      let depts = Object
         .entries(filter)                  /* Get list of key-value pairs */
         .filter((kv) => kv[1] === true)   /* Filter only those with true value */
         .map((kv) => kv[0].toLowerCase())               /* Get just the dept names */

      console.log('depts:', depts);
      let courses = this.props.Courses.sections.filter((c) => {
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

      console.log('courses: ', courses);
      let filteredByName = courses
      /* Filter name by search query */
         .filter((c) => c.name.toLowerCase()
            .includes(this.props.Courses.searchQuery.toLowerCase()));

      let filteredByDescription = courses
      /* Filter description by search query */
         .filter((c) => c.description.toLowerCase()
            .includes(this.props.Courses.searchQuery.toLowerCase()));

      /* Join the two sets */
      let filteredCourses =
         [...new Set([...filteredByName, ...filteredByDescription])]
         /* Filter by enrolled only if given */
         .filter((c) => this.props.Courses.onlyEnrolled ?
            /* If user is enrolled, the course id will be in the props User.enrolled array */
            this.props.User.enrolled.find((id) => id === c.id) == null : true)
         /* Sort by given order */
         .sort((c1, c2) => {
            let mult = this.props.Courses.sortOrder === 'ASC' ? 1 : -1;
            let c1Year = +c1.term.slice(1);
            let c1Quarter = c1.term.slice(0,1);
            let c2Year = +c2.term.slice(1);
            let c2Quarter = c2.term.slice(0,1);
            let quarters = ['S', 'F', 'W'];

            if (c1Year < c2Year)
               return -1 * mult;
            else if (c1Year > c2Year)
               return 1 * mult;
            else {
               if (quarters.indexOf(c1Quarter) < quarters.indexOf(c2Quarter))
                  return -1 * mult;
               else
                  return 1 * mult;
            }
         })
         .map((c) => {
            let cYear = +c.term.slice(1);
            let cQuaterShort = c.term.slice(0,1);
            let cQuater =
               cQuaterShort === 'W' ? 'Winter '
               : cQuaterShort === 'F' ? 'Fall '
               : cQuaterShort === 'S' ? 'Spring '
               : '';
            return {
               ...c,
               term: cQuater + cYear
            }
         });

      console.log('filteredCoursesByName:', filteredByName);
      console.log('filteredCoursesByDesc:', filteredByDescription);
         console.log('filteredCourses:', filteredCourses);

      return (
         <div className="cs-wrapper">
            <div className="cs-sidebar-container">
               <CoursesFilterSidebar {...this.props} />
            </div>
            
            <div className="cs-main">
               <div className="cs-header">
                  <input type="text"
                         placeholder="Search Classes..."
                         id='filter'
                         value={this.props.Courses.searchQuery == null ? '' : this.props.Courses.searchQuery}
                         onChange={(e) => this.updateQuery(e.target.value)}/>
               </div>

               {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" isEnrolled={true} />*/}
               {/*<CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018" />*/}

               {
                  filteredCourses.map((c, idx) => this.renderCourse(c, idx))
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
