
import React, { Component } from 'react';
import './CourseDetail.css';
import { Link } from "react-router-dom";
import Video from '../Video/Video';
import Activity from '../Activity/Activity';
import CourseSidebar from '../CourseSidebar/CourseSidebar';

export default class CourseDetail extends Component {
   constructor(props) {
      super(props);

      this.state = { };
      
      //this.props.addTopicsAndActivities(4);
      this.props.addVideos(4);
   }

   render() {
      return (
         <div className="cd-wrapper">
            <h1>CourseDetail page header</h1>

            <div className="cd-main-wrapper">

               <div className="cd-sidebar-container">
                  <h2>Course Name</h2>
                  <CourseSidebar title="Number Systems" {...this.props}/>
               </div>

               <div className="cd-main-body">
                  course detail main body
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>

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
