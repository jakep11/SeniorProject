import React, { PureComponent } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import './ConfDialog.css';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ConfDialog extends PureComponent {
   close = (result) => {
      this.props.onClose(result)
   }

   render() {
      console.log("Rendering ConfDialog,", this.props.show);
      let dialogStyle = this.props.show ? 
         {display: "block", backgroundColor: "RGBA(100, 100, 100, 0.5)"} : 
         {display: "none"};
      
      return (
         <Modal.Dialog style={dialogStyle}>
            <Modal.Header>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{this.props.body}</Modal.Body>

            <Modal.Footer>
               <Button onClick={() => this.props.onClose(this.props.button)}>
                  {this.props.button}
               </Button>
            </Modal.Footer>
         </Modal.Dialog>
      )
   }
}



