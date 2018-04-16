
import React, { Component } from 'react';
import CourseBlock from "../CourseBlock/CourseBlock";

export default class Courses extends Component {
   constructor(props) {
      super(props);

      this.state = {
         progress: 10
      };

      let mult = 1;

      setInterval(() => {
         if (this.state.progress >= 100 || this.state.progress <= 0)
            mult *= -1;
         this.setState({ progress: this.state.progress + mult * 10});
      }, 320);
   }

   render() {
      return (
         <div>
            <h1>Courses</h1>
            <CourseBlock title="CPE-453" progress={this.state.progress} term="Fall 2018"></CourseBlock>
         </div>
      )

   }
}
