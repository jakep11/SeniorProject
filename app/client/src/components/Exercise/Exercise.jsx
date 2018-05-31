import React, { Component } from 'react';
import './Exercise.css';

export default class Exercise extends Component {
   constructor(props) {
      super(props);
      
      this.state = {
         answer: ""
      };
      
      this.handleChange = this.handleChange.bind(this);
   }
   
   handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
   }   
   
   submit() {
      this.props.setMessage("Correct!", "success");
   }
   
   render() {
      return (
         <div className="exercise-wrapper">
            <div className="exercise-question">What is the answer to life?</div>
            <div className="exercise-border" />
            <div className="exercise-body">
               <div>Enter answer:</div>
               <div><input type="text" name="answer" onKeyUp={this.handleChange} /></div>
            </div>
            <button type="button" onClick={() => this.submit()}>Submit</button>            
         </div>
      );
   }
}
