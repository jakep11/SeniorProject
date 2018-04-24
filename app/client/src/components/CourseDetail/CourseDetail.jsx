
import React, { Component } from 'react';
import './CourseDetail.css';
import { Link } from "react-router-dom";
import Video from "../Video/Video";

export default class CourseDetail extends Component {
   constructor(props) {
      super(props);

      this.state = { };
   }

   render() {
      return (
         <div className="cd-wrapper">
            <h1>CourseDetail page header</h1>

            <div className="cd-main-wrapper">

               <div className="cd-sidebar-container">
                  course detail sidebar
               </div>

               <div className="cd-main-body">
                  course detail main body
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>
                  <p>course detail main body has lots of content</p> <p>course detail main body has lots of content</p>

                  <Video videoId="dQw4w9WgXcQ"></Video>
                  <Video videoId="dQw4w9WgXcQ"></Video>
                  <Video videoId="dQw4w9WgXcQ"></Video>
                  <Video videoId="dQw4w9WgXcQ"></Video>
                  <Video videoId="dQw4w9WgXcQ"></Video>

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
