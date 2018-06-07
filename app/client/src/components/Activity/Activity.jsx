
import React, { Component } from 'react';

import * as api from '../../api';
import './Activity.css';

export default class Activity extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showContent: false
      }
   }

   render() {
      return (
         <div className="act-wrapper">
            <div className="act-bar-wrapper"
                 onClick={() => {
                    /* If this is a video, update progress */
                    if (this.props.type === 'video' && !this.state.showContent) {
                       let body = {
                          activityId: this.props.activity.id,
                          activityType: this.props.activity.activityType,
                          grade: 100
                       };
                       console.log('body:', body);
                       api.modifyUserProgress(this.props.User.info.id, body);
                    }
                    this.setState({ showContent: !this.state.showContent});
                 }}>

               <div className="act-icon">
                  { this.props.type === 'video' && <i className="fas fa-play"></i> }
                  { this.props.type === 'problems' && <i className="fas fa-pencil-alt"></i> }
                  { this.props.type === 'form' && <i className="fas fa-file"></i> }
               </div>

               <div className={'act-main' + (this.props.done ? ' done' : '' )}>

                  <div className="act-title">{this.props.title}</div>

                  <div className="act-right">
                     {this.props.right}
                  </div>

               </div>
            </div>

            {
               this.state.showContent &&
               <div className="act-content">{this.props.content}</div>
            }

         </div>
      )

   }
}
