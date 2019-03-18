import React from 'react';
import PropTypes from 'prop-types'
import store from '../../redux/store/index';
import { setCurrPopupID } from "../../redux/actions/index";
import swal from 'sweetalert';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Plugincard.css";

/*
* This component represents the plugin cards. This compenent is
* a child of Plugin Picker. Once drag and drop is implemented 
* we capture the id of a clicked plugin and send that id to the parent
* App.js
*/ 
let pluginModule = require('../Plugins');


class DraggablePlugins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: null
    };
    //this.handleClick = this.handleClick.bind(this);
  }

  /*
  * This function captures the event and determines the id of the clicked plugin.
  * This id is in turn sent up to PluginApp.js in order to tick the element at 
  * the index of the id.
  */
  handleClick = e => { 
    e.preventDefault();
    store.dispatch(setCurrPopupID(e.currentTarget.dataset.id));
    if(this.props.visibility === 'hidden') {
      this.props.handlerFromParent(e.currentTarget.dataset.id);
    } else {
      swal("Port: " + pluginModule.plugins[store.getState().currPopupID].port, {
        content: "input",
      })
      .then((value) => {
        return pluginModule.plugins[store.getState().currPopupID].port = value;
      });
    }
  }

  handleInnerClick = e => {
    e.stopPropagation();
    this.props.handlerFromParent(e.currentTarget.dataset.id);
  }
  
  render() {
    return ( 
      <div className="cardbody" data-id={this.props.id} onClick={this.handleClick}>
        <div className="img-holder">
          <div>
            <img 
              className="main-img" 
              src={window.location.origin + this.props.image}
              alt='main'
            ></img>
            <img 
              className="close-img" 
              src={'/images/close.png'}
              alt='close'
              data-id={this.props.id}
              style={{visibility: this.props.visibility}}
              onClick={this.handleInnerClick}
            ></img>
          </div>
          <div>
            <p className="cardtext">{this.props.pluginName}</p>
          </div>
        </div>
      </div>
    );
  }
};
export default DraggablePlugins;

DraggablePlugins.propTypes = {
  pluginName:         PropTypes.string.isRequired,
  image:              PropTypes.string.isRequired,
  handlerFromParent:  PropTypes.func.isRequired,
  id:                 PropTypes.number.isRequired,
  visibility:         PropTypes.string.isRequired
}