import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from 'react-sidebar';

const styles = {
   sidebar: {
      width: 256,
      height: '100%'
   },
   divider: {
      //margin: '8px 0',
      height: 2,
      backgroundColor: 'blue',
   }
};

export default class Sydebar extends Component {
   constructor(props) {
      super(props);

      this.state = {
         sidebarOpen: true
      }

      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
   }

   onSetSidebarOpen(open) {
      this.setState({sidebarOpen: true});
   }

   render() {
      var sidebarContent =
         <div style={styles.sidebar}>
            {this.props.titleBar}
            <div style={styles.divider} />
            {this.props.content}
         </div>

      return (
         <Sidebar
            sidebar={sidebarContent}
            open={this.state.sidebarOpen}
            docked={true}
            onSetOpen={this.onSetSidebarOpen}
            children={this.props.children}>
         </Sidebar>
      )
   }
}
