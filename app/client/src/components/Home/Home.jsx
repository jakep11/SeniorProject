
import './Home.css';
import React, { Component } from 'react';

export default class Home extends Component {
   constructor(props) {
      super(props);

     // this.props.updateEnrolled();

      this.state = {
         enrolled: [],
         tasks: [],
      }
   }

   render() {
      return (
         <div className="hm-wrapper">
            
            <section className="hm-section hm-enrolled">
               <h1>Enrolled</h1>

               <div className="hm-section-body">
                  { this.state.enrolled.length === 0
                     ? 'You are not enrolled in any classes.'
                     : 'you are enrolled in some classes. wip'
                  }
               </div>

            </section>

            <section className="hm-tasks">
               <h1>Tasks</h1>
               <div className="hm-section-body">
                  { this.state.tasks.length === 0
                     ? 'You don\'t have any tasks at the moment.'
                     : 'you have some tasks. wip'
                  }
               </div>
            </section>

         </div>


      )

   }
}
