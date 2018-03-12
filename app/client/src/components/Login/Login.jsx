
import React, { Component } from 'react';

export default class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: ''
      }

      this.handleChange = this.handleChange.bind(this)
   }

   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
   }

   submit() {
      console.log('Submit login')
      console.log('this.props:', this.props);
   }

   render() {
      return (
         <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username" name="username" onKeyUp={this.handleChange} />
            <input type="password" placeholder="Password" name="password" onKeyUp={this.handleChange} />
            <br />
            <button type="button" onClick={() => this.submit()}>Submit</button>
         </div>
      )

   }
}
