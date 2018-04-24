import React, { Component } from 'react';

import './CourseSidebar.css';

export default class CourseSidebar extends Component {
   constructor(props) {
      super(props);

      this.state = { };
   }
   
   render() {
      return(
         <h4>{this.props.title}</h4>
      )
   }
}
