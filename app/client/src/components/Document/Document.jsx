import React, { Component } from 'react';
import './Document.css';

import { Dropbox } from 'dropbox';


export default class Document extends Component {
   constructor(props) {
      super(props);
      
      this.getFile = this.getFile.bind(this);
      this.download = this.download.bind(this);
   }
   
   getFile(link) {
      let dbx = new Dropbox({accessToken: 
         "zPeJP5gTISAAAAAAAAAADVkN_MPT3KJDbmUW6XSVxnnIKCK0eiiePxwGgIp73Nag"
      });
   
      console.log("Getting requested file:", link);
   
      dbx.sharingGetSharedLinkFile({url: link})
         .then(data => {    
            let a = document.createElement("a");
            
            a.style = "display: none";
            a.href = URL.createObjectURL(data.fileBlob);
            a.download = this.props.name;
            
            document.body.appendChild(a);
            a.click();
         })
         .catch(error => this.props.setError(error));
   }
   
   download(path, name) {
      let dbx = new Dropbox({accessToken: 
         "zPeJP5gTISAAAAAAAAAADVkN_MPT3KJDbmUW6XSVxnnIKCK0eiiePxwGgIp73Nag"
      });
     
      let fullPath = path + name;
      
      dbx.sharingListSharedLinks({
         "path" : fullPath
      }).then((data0) => {
         if (data0.links.length === 0) {
            dbx.sharingCreateSharedLinkWithSettings({
               "path": fullPath,
               "settings": {
                  "requested_visibility": "public"
               }
            }).then(data => {
               this.getFile(data.url);
            })
            .catch(error => this.props.setError(error));
         } else {
            console.log("This??", this);
            this.getFile(data0.links[0].url);
         }
      })
   }
   
   
   
   render() {
      return (
         <span className="document-wrapper">
            {this.props.name} &nbsp;
            <button type="button" onClick={() => 
               this.download(this.props.path, this.props.name)}>
                  Download
               </button>            
         </span>
      );
   }
}
