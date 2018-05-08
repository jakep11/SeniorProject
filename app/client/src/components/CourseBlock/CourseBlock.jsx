
import './CourseBlock.css';
import React, { Component } from 'react';
import { Line, Circle } from 'rc-progress';

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

            <div className="cb-icon"></div>

            <div className="cb-body">

               <div className="cb-body-row1">
                  <h2 className="cb-title">{this.props.title}</h2>
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
                        <button className="cb-enroll-button">Enroll</button>
                     </div>
                  }
               </div>
            </div>
         </div>
      )

   }
}
