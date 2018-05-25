
import React, { Component } from 'react';
import './CourseDetail.css';
import { Link } from "react-router-dom";
import Video from '../Video/Video';
import Activity from '../Activity/Activity';
import CourseSidebar from '../CourseSidebar/CourseSidebar';

export default class CourseDetail extends Component {
   
   constructor(props) {
      super(props);

      let courseId = +this.props.location.pathname.split('/').slice(-1)[0];
      let course = this.props.Courses.sections.find((s) => s.id === courseId);
      console.log('course: ', course);

      this.state = {
         course
      };

      //this.props.addTopicsAndActivities(4);
      //this.props.addVideos(4);
      
      
   }

   render() {
      const topicList = ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"];
      
      return (
         <div className="cd-wrapper">

            <div className="cd-main-wrapper">

               <div className="cd-sidebar-container">
                  <h2>{this.state.course.description}</h2>
                  <CourseSidebar title="Topics" topics={topicList} {...this.props}/>
               </div>

               <div className="cd-main-body">
               
                  <div className="cd-topic-container">
                     <h3 id={topicList[0]}>Topic name 1</h3>
                     <Activity title="Intro to Boolean Algebra"
                               type="video"
                               right="5 minutes, 31 seconds"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />

                     <Activity title="Boolean Algebra Basics"
                               type="problems"
                               right="4 Problems"
                               content={
                                  <h2 style={{backgroundColor: "blue", color: "white"}}>pROBLEMS hERE</h2>
                               } />

                     <Activity title="Boolean Algebra Forms"
                               type="form"
                               right="321 Words"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />
                  </div>

                  <div className="cd-topic-container">
                     <h3 id={topicList[1]}>Topic name 2</h3>
                     <Activity title="Intro to Boolean Algebra"
                               type="video"
                               right="5 minutes, 31 seconds"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />

                     <Activity title="Boolean Algebra Basics"
                               type="problems"
                               right="4 Problems"
                               content={
                                  <h2 style={{backgroundColor: "blue", color: "white"}}>pROBLEMS hERE</h2>
                               } />

                     <Activity title="Boolean Algebra Forms"
                               type="form"
                               right="321 Words"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />
                          
                  </div>
                  
                  <div className="cd-topic-container">
                     <h3 id={topicList[2]}>Topic name 3</h3>
                     <Activity title="Intro to Boolean Algebra"
                               type="video"
                               right="5 minutes, 31 seconds"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />

                     <Activity title="Boolean Algebra Basics"
                               type="problems"
                               right="4 Problems"
                               content={
                                  <h2 style={{backgroundColor: "blue", color: "white"}}>pROBLEMS hERE</h2>
                               } />

                     <Activity title="Boolean Algebra Forms"
                               type="form"
                               right="321 Words"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />
                          
                  </div>
                  
                  <div className="cd-topic-container">
                     <h3 id={topicList[3]}>Topic name 4</h3>
                     <Activity title="Intro to Boolean Algebra"
                               type="video"
                               right="5 minutes, 31 seconds"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />

                     <Activity title="Boolean Algebra Basics"
                               type="problems"
                               right="4 Problems"
                               content={
                                  <h2 style={{backgroundColor: "blue", color: "white"}}>pROBLEMS hERE</h2>
                               } />

                     <Activity title="Boolean Algebra Forms"
                               type="form"
                               right="321 Words"
                               content={
                                  <Video videoId="dQw4w9WgXcQ"></Video>
                               } />
                          
                  </div>
            
                  {/*<Video videoId="dQw4w9WgXcQ"></Video>*/}
                  {/*<Video videoId="dQw4w9WgXcQ"></Video>*/}
                  {/*<Video videoId="dQw4w9WgXcQ"></Video>*/}
                  {/*<Video videoId="dQw4w9WgXcQ"></Video>*/}

                  {/*videoId=""*/}
               </div>
               
            </div>

            {/*<Switch>*/}
               {/*<Route exact path="/home" component={Home} />*/}
            {/*</Switch>*/}

         </div>
      )

   }
}
