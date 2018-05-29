import React, { Component } from 'react';

import './CourseSidebar.css';

export default class CourseSidebar extends Component {
   constructor(props) {
      super(props);

      this.state = { };
   }
   
   render() {
      const topicRows = [];
      
      this.props.topics.forEach((topic, i) => {
         let anchor = "#" + topic;
         topicRows.push(
            <a href={anchor} key={i}>{topic}</a>
         );
      });
   
      return(
         <div className="cd-sidebar-wrapper">
            {topicRows}
         </div>
      )
   }
}
