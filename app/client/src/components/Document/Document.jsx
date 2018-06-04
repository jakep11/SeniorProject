import React, { Component } from 'react';
import './Document.css';

import { Dropbox } from 'dropbox';


export default class Document extends Component {
   constructor(props) {
      super(props);
   }
   
   download() {
      let dbx = new Dropbox({accessToken: "zPeJP5gTISAAAAAAAAAADVkN_MPT3KJDbmUW6XSVxnnIKCK0eiiePxwGgIp73Nag"});
      
      let link = "https://www.dropbox.com/s/p10u86f712m8bze/3.pdf?dl=0";
      
      dbx.sharingGetSharedLinkFile({url: link})
         .then(data => {    
            let a = document.createElement("a");
            
            a.style = "display: none";
            a.href = URL.createObjectURL(data.fileBlob);
            a.download = "Test.pdf";
            
            document.body.appendChild(a);
            a.click();
         })
         .catch(error => console.log(error));
   }
   
   render() {
      return (
         <span className="document-wrapper">
            Test document &nbsp;
            <button type="button" onClick={() => this.download()}>Download</button>            
         </span>
      );
   }
}
