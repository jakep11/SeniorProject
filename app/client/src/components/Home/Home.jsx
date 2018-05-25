
import './Home.css';
import React, { Component } from 'react';
import Link from "react-router-dom/es/Link";
import CourseBlock from "../CourseBlock/CourseBlock";

export default class Home extends Component {
   constructor(props) {
      super(props);

     this.props.updateEnrolled();

     console.log(this.props);

      this.state = {
         enrolled: [],
         tasks: [],
      }
   }

   renderCourse(courseId, idx) {
      let course = this.props.Courses.sections.filter((c) => c.id === courseId)[0];
      let isEnrolled = this.props.User.enrolled.find((id) => id === course.id) == null;
      console.log('Render Course Home Course: ', course);
      return (
         <Link key={course.id} to={`/courses/${course.id}`} className='hm-course-link'>
            <CourseBlock course={course}
                         progress={0}
                         showProgress={this.props.Courses.showProgress}
                         showEnroll={isEnrolled}
                         term={course.term}
                         isEnrolled={true} />
         </Link>
      );
   }

   render() {
      return (
         <div className="hm-wrapper">
            
            <section className="hm-section hm-enrolled">
               <h1>Enrolled</h1>

               <div className="hm-section-body">
                  { this.props.User.enrolled && this.props.User.enrolled.length !== 0
                     ? this.props.User.enrolled.map((courseId, idx) => this.renderCourse(courseId, idx))
                     : 'You are not enrolled in any classes.'
                  }
               </div>

            </section>

            <section className="hm-tasks">
               <h1>Tasks</h1>
               <div className="hm-section-body">
                  { this.state.tasks.length === 0
                     ? 'You don\'t have any tasks at the moment.'
                     : 'you have some tasks. wip'
                  }
               </div>
            </section>

         </div>
      );
   }
}
