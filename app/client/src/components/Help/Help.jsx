
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class Help extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div>
            <h1>SOS!</h1>

            <Button onClick={() => this.props.setError('This is a fake error!', () => console.log('setError callback ran'))}>
               Set an Error
            </Button>


         </div>
      )

   }
}
