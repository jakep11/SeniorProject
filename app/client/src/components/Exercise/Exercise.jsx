import React, { Component } from 'react';
import * as api from '../../api';
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
      if (this.state.answer === "") return;
   
      api.modifyExerciseGrade(this.props.exercise.id, {answer: this.state.answer})
         .then((res) => {
            console.log('res:', res);
            if (res.isCorrect) {
               this.props.setMessage("Correct!", "success");
            }
            else {
               this.props.setMessage("Incorrect! Please try again.", "danger");
            }
         });
   }
   
   render() {
      return (
         <div className="exercise-wrapper">
            <div className="exercise-question">{this.props.exercise.question}</div>
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
