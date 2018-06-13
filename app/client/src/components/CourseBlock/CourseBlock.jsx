
import './CourseBlock.css';
import React, { Component } from 'react';
import { Line } from 'rc-progress';
import {Button} from "react-bootstrap";

export default class CourseBlock extends Component {
   constructor(props) {
      super(props);
      this.state = {
         progress: 66,
      }
   }

   render() {
      console.log('showProg:', this.props.showProgress);
      let progressBarOptions = {
         strokeWidth: 2,
         strokeColor: '#00cc00',
         trailColor: '#575757',
         percent: this.props.isEnrolled ? this.props.progress : 0,
      };
      return (
         <div className="cb-wrapper">

            <div className="cb-icon">
               <div className="ico"><i className="fas fa-tachometer-alt"></i></div>
               <div className="name">{this.props.course.name}</div>
            </div>

            <div className="cb-body">

               <div className="cb-body-row1">
                  <h2 className="cb-title">{this.props.course.description}</h2>
                  <div className="term">{this.props.term}</div>
               </div>

               <div className="cb-body-row2">
                  <div className="cb-line-wrapper">
                     <Line { ...progressBarOptions } />
                  </div>

                  { this.props.isEnrolled && this.props.showProgress &&
                     <div className="cb-progress">{this.props.progress}% Completed</div>
                  }

                  { this.props.showEnroll &&
                     <div className="cb-enroll">
                        <Button bsStyle="info"
                                className="cb-enroll-button"
                                onClick={(e) => {
                                   this.props.enrollInCourse(this.props.course.id);
                                   e.stopPropagation();
                                   e.preventDefault();
                                }}>Enroll</Button>
                     </div>
                  }
               </div>
            </div>
         </div>
      )

   }
}
