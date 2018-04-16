
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
      let progressBarOptions = {
         strokeWidth: 2,
         strokeColor: '#00cc00',
         trailColor: '#575757',
         percent: this.props.progress,
      };
      return (
         <div className="cb-wrapper">

            <div className="cb-icon"></div>

            <div className="cb-body">
               <h2 className="cb-title">{this.props.title}</h2>

               <Line { ...progressBarOptions } />
            </div>

            <div className="cb-right">
               <div className="term">{this.props.term}</div>


            </div>
         </div>
      )

   }
}
