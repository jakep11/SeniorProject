
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';
import ConfDialog from '../ConfDialog/ConfDialog';
import './SignUp.css';

export default class SignUp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         
         email: '',
         password: '',
         confirmPassword: '*'
      };

      if (this.props.User.isLoggedIn) {
         console.log('User is logged in; sending to /home');
         this.props.history.push('/home')
      }

      this.handleChange = this.handleChange.bind(this)
      console.log("SignUp Props:", this.props);
   }

   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
      console.log("New state:", this.state);
   }

   submit() {
      console.log('Signing Up');
      let creds = { 
          email: this.state.email, 
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          termsAccepted: new Date(),
          role: 0
        };
      this.props.signUp(creds, () => this.props.history.push('/home'));
   }

   render() {
      return (
         <div>
            <Navbar {...this.props} />
            
            <div className="signup-wrapper">
               <h1>Sign Up</h1>
               <form className="signup-body">
                  <FormGroup >
                     <ControlLabel>Email</ControlLabel>
                     <FormControl type="email" name="email" placeholder="Email" onChange={this.handleChange} />
                     <FormControl.Feedback />
                  </FormGroup>
                  <FormGroup>
                     <ControlLabel>First Name</ControlLabel>
                     <FormControl type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                     <ControlLabel>Last Name</ControlLabel>
                     <FormControl type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                     <ControlLabel>Password</ControlLabel>
                     <FormControl type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                     <ControlLabel>Confirm Password</ControlLabel>
                     <FormControl type="password" name="confirmPassword" placeholder="Confirm Password" onChange={this.handleChange} />
                  </FormGroup>
                  <ControlLabel>By clicking Submit, you agree to the terms and conditions of this website.</ControlLabel>
                  <FormGroup>
                     <button disabled={this.state.password !== this.state.confirmPassword} type="button" onClick={() => this.submit()}>Submit</button>
                  </FormGroup>
               </form>
            </div>
            
            <ConfDialog
               show={this.props.Error.message !== ''}
               title="Notice"
               body={
                  <ListGroup>
                     <ListGroupItem bsStyle="danger">
                        {this.props.Error.message}
                     </ListGroupItem>
                  </ListGroup>}
               button='OK'
               onClose={() => {this.props.clearError()}}
            />
         </div>
      )

   }
}
