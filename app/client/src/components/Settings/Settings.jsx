
import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import './Settings.css';

export default class Settings extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         password: "",
         oldPassword: "",
         oldPasswordAgain: "",
         message: "",
         style: "info"
      };
      
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
   }
   
   submit() {
      let body = {};
      //console.log("Props:", this.props);
      let userId = this.props.User.info.id;
      let admin = this.props.User.info.role 
      
      
      for (var key in this.state) {
         if (this.state.hasOwnProperty(key) && this.state[key])
            body[key] = this.state[key];
      }
      
      if (!admin && (body.oldPassword !== body.oldPasswordAgain || !body.oldPassword)) {
         this.setState({message: "Missing/Mismatched passwords", style: "warning"});
         return;
      } else {
         this.setState({message: "", style: "info"});
      }
      
      delete body.oldPasswordAgain;
      delete body.message;
      delete body.style;
      
      console.log("State:", this.state);
      console.log('Changing information w/ body:', body);
      
      this.props.updateUser(userId, body);
   }
   
   renderMessage(msg, style) {
      if (msg)
         return (
            <ListGroup className="settings-message">
               <ListGroupItem bsStyle={style}>{msg}</ListGroupItem>
            </ListGroup>
         );
   }
   
   renderCurrentPassword() {
      if (!this.props.User.info.role)
         return (
            <div className="settings-body">
               <div>Enter current password:</div>
               <div><input 
                  type="password" 
                  placeholder="Current password" 
                  name="oldPassword" 
                  onKeyUp={this.handleChange} />
               </div>
               <div>Enter current password again:</div>
               <div><input 
                  type="password" 
                  placeholder="Current password again" 
                  name="oldPasswordAgain" 
                  onKeyUp={this.handleChange} />
               </div>
            </div>
         ); 
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
               {this.renderCurrentPassword()}
               <br />
               <button type="button" onClick={() => this.submit()}>Submit</button>
               {this.renderMessage(this.state.message, this.state.style)}
         </div>
      );

   }
}
