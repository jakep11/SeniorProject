
import React, { Component } from 'react';
import './CourseDetail.css';
import { Link } from "react-router-dom";
import Video from '../Video/Video';
import Exercise from '../Exercise/Exercise';
import Document from '../Document/Document';
import Activity from '../Activity/Activity';
import CourseSidebar from '../CourseSidebar/CourseSidebar';
import {Button} from "react-bootstrap";
import * as api from "../../api";

export default class CourseDetail extends Component {
   
   constructor(props) {
      super(props);

      let courseId = +this.props.location.pathname.split('/').slice(-1)[0];
      let course = this.props.Courses.sections.find((s) => s.id === courseId);
      console.log('course: ', course);

      api.getTopics(courseId)
         .then((topics) => {
            // this.setState({ topics });

            let promises = topics.map((t) =>
               api.getActivities(t.id).then((activities) => ({ ...t, activities }))
            );

            return Promise.all(promises);
         })

         .then((topics) => {
            console.log('topics: ', topics);
            this.setState({ topics });
         });

      this.state = {
         course,
         topics: []
      };

   }

   renderActivities(activities) {

      console.log('activities: ', activities);
      let videos = activities.videos;
      let documents = activities.documents;
      let exercises = activities.exercises;

      console.log('videos:', videos);
      console.log('documents:', documents);
      console.log('exercises:', exercises);

      return (
         <div>

            <div className="videos">
               { videos.map((v, idx) => (
                  <Activity title={v.name}
                            key={idx}
                            type="video"
                            right={"Due: " + v.dueDate.substring(0, 10)}
                            content={
                               <Video videoId={v.link}/>
                            } />
               ))}
            </div>

            <div className="problems">
               { exercises
                  .sort((a,b) => a.name < b.name ? -1 : 1)
                  .map((e, idx) => (
                  <Activity title={e.name}
                            type="problems"
                            key={idx}
                            right={"Due: " + e.dueDate.substring(0, 10)}
                            content={
                               <Exercise exercise={e} {...this.props}/>
                            }
                  />
               ))}
            </div>

            <div className="documents">
               { documents.map((d, idx) => (
                  <Activity title={d.name}
                            key={idx}
                            type="form"
                            right={"Due: " + d.dueDate.substring(0, 10)}
                            content={
                               <Document 
                                 name={d.name} 
                                 path={d.contentPath} 
                                 {...this.props}
                              />
                            } />
               ))}
            </div>

         </div>
      );
   }


   renderTopics(topics) {

      return topics.map((t) => (
         <div className="cd-topic-container" key={t.id}>

            <h3 id={t.name}>{t.name}</h3>

            { this.renderActivities(t.activities) }

         </div>
      ));
   }

   render() {

      let topics = this.state.topics;

      // const topicList = ["Topic1", "Topic2", "Topic3", "Topic4", "Topic5", "Topic6"];

      let courseId = +this.props.location.pathname.split('/').slice(-1)[0];
      let course = this.props.Courses.sections.find((s) => s.id === courseId);
      let isEnrolled = this.props.User.enrolled.find((id) => id === course.id) != null;

      console.log('isEnrolled: ', isEnrolled)

      return (

         <div className="cd-wrapper">

            <div className="cd-main-wrapper">

               <div className="cd-sidebar-container">
                  <h2>{this.state.course.description}</h2>
                  <div className="enrollment-row">
                     <Link className= "enrollment-row-link" to={'/Courses'}>
                        {"<- Return to Courses"}
                     </Link>

                     { isEnrolled &&
                     <div className="cd-unenroll">
                        <Button
                           onClick={(e) => {
                              this.props.unenrollInCourse(this.state.course.id);
                              e.stopPropagation();
                              e.preventDefault();
                           }}>Drop</Button>
                     </div>
                     }

                     { !isEnrolled &&
                     <div className="cb-enroll">
                        <Button
                           onClick={(e) => {
                              this.props.enrollInCourse(this.state.course.id);
                              e.stopPropagation();
                              e.preventDefault();
                           }}>Enroll</Button>
                     </div>
                     }

                  </div>
                  <div className="cd-sidebar-body">
                     <CourseSidebar title="Topics" topics={topics} {...this.props}/>
                  </div>
               </div>

               <div className="cd-main-body">

                  { this.renderTopics(topics) }
               </div>
               
            </div>

         </div>
      )

   }
}
