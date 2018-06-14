import React, { PureComponent } from 'react';
import { Modal, Button, FormControl, ListGroup, Label } from 'react-bootstrap';
import './InputDialog.css';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ConfDialog extends PureComponent {
   constructor(props) {
      super(props)
      
      this.state = {};
      
      this.handleChange = this.handleChange.bind(this);
   }
   
   handleChange(event) {
      console.log("name", event.target.name, "new val:", event.target.value);
      this.setState({[event.target.name]: event.target.value});
   }

   close = (result) => {
      this.props.onClose(result)
   }
   
   renderMessage(msg, style) {
      if (msg)
         return msg;
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

            <Modal.Body>
               {this.props.body}
               <div>
                  <FormControl 
                     placeholder={this.props.placeholder}
                     inputRef={ref => { this.input = ref; }} 
                     name="inputField"
                     onChange={this.handleChange}
                  />
               </div>
            </Modal.Body>

            <Modal.Footer className="modal-footer">
               <div className="modal-left">
                  {(() => {
                     if (!this.state.inputField)
                        return this.renderMessage('Empty field not valid!', 'danger')
                  })()}
               </div>
               <div className="modal-right">
                  {this.props.buttons.map((btn, i) => 
                     <span className="modal-button" key={i}>
                        <Button   
                           onClick={() => {
                              if (this.input.value || btn === 'Cancel') {
                                 this.props.onClose(btn, this.input.value);
                                 this.input.value = '';
                                 this.setState({inputField : ''});
                              }}}>
                           {btn}
                        </Button>
                     </span> 
                  )}
               </div>
            </Modal.Footer>
         </Modal.Dialog>
      )
   }
}



