import React, { Component } from 'react';
import YouTube from 'react-youtube';
import './Video.css';

export default class Video extends Component {

   render() {
      const opts = {
         height: '390',
         width: '640',
         playerVars: { 
            autoplay: 0
         }
      };

      return (
         <div>
            <YouTube
               videoId={this.props.videoId}
               opts={opts}
            />
         </div>

      );
   }
}
