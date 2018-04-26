import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';
import YouTube from 'react-youtube'; 
import './Video.css';

export default class Video extends Component {
   constructor(props) {
      super(props);
   }   
   
   render() {
      const opts = {
         height: '390',
         width: '640',
         playerVars: { 
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0
         }
      };

      return (
         <Grid>
            <Row>
               <div>
                  <h1>Video</h1>
                  <hr />
                  <YouTube
                     videoId={this.props.videoId}
                     opts={opts}
                  />
                  {/*videoId="dQw4w9WgXcQ"*/}
                  </div>
               </Row>
         </Grid>
      );
   }
}
