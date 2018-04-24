
import React, { Component } from 'react';
import {Overlay} from 'react-bootstrap';
import './Settings.css';

export default class Settings extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         password: "",
         oldPassword: "",
         oldPasswordAgain: "",
         show: false,
         success: false
      };
      
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
   }
   
   submit() {
      let body = {};
      //console.log("Props:", this.props);
      let userId = this.props.User.userId;
      
      
      for (var key in this.state) {
         if (this.state.hasOwnProperty(key) && this.state[key])
            body[key] = this.state[key];
      }
      
      if (body.oldPassword !== body.oldPasswordAgain || !body.oldPassword) {
         console.log('Bad passwords');
         return;
      }
      
      delete body.oldPasswordAgain;
      delete body.show;
      delete body.success;
      
      //body = this.state.map((item) => item);
      console.log("State:", this.state);
      console.log('Changing information w/ body:', body);
      
      this.props.updateUser(userId, body);
   }

   render() {
      return (
         <div className='settings-wrapper'>
            <h1>Settings</h1>
            <div className="settings-body settings-border">
               {/*<div>Enter new email:</div>
               <div><input type="text" placeholder="New email" name="email" onKeyUp={this.handleChange} /></div>*/}
               <div>Enter new password:</div>
               <div><input type="password" placeholder="New password" name="password" onKeyUp={this.handleChange} /></div>
            </div>
            <div className="settings-body">
               <div>Enter current password:</div>
               <div><input type="password" placeholder="Current password" name="oldPassword" onKeyUp={this.handleChange} /></div>
               <div>Enter current password again:</div>
               <div><input type="password" placeholder="Current password again" name="oldPasswordAgain" onKeyUp={this.handleChange} /></div>
            </div>
                <button type="button" onClick={() => this.submit()}>Submit</button>

         </div>
      );

   }
}
