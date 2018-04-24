
import React, { Component } from 'react';
import './Settings.css';

export default class Settings extends Component {
   constructor(props) {
      super(props);
      this.state = {
         newUsername: null,
         newPassword: null,
         oldPassword: null,
         oldPasswordAgain: null
      };
      
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
   }
   
   submit() {
      if (this.state.oldPassword !== this.state.oldPasswordAgain) {
         console.log('Bad passwords');
      }
      console.log('Changing information');
      
   }

   render() {
      return (
         <div className='settings-wrapper'>
            <h1>Settings</h1>
            <div className="settings-body">
               <span>
                  Enter new password:&nbsp;
                  <input type="text" placeholder="New password" name="newPassword" onKeyUp={this.handleChange} />
               </span>
               <span>
                  Enter old password:&nbsp;
                  <input type="text" placeholder="Old password" name="oldPassword" onKeyUp={this.handleChange} />
               </span>
               <span>
                  Enter old password again:&nbsp;
                  <input type="text" placeholder="Old password again" name="oldPasswordAgain" onKeyUp={this.handleChange} />
               </span>
               <span>
                  <button type="button" onClick={() => this.submit()}>Submit</button>
               </span>
            </div>
         </div>
      );

   }
}
