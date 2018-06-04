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
         let anchor = "#" + topic.name;
         topicRows.push(
            <a href={anchor} key={i}>{topic}</a>
         );
      });
   
      return(
         <div className="cd-sidebar-wrapper">
            {this.props.topics.map((t, idx) => (
               <a href={'#' + t.name} key={idx}>{t.name}</a>
            ))}
         </div>
      )
   }
}
