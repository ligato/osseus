import React from 'react';
import PropTypes from 'prop-types'
import store from '../../redux/store/index';
import { setCurrPopupID } from "../../redux/actions/index";
import Swal from 'sweetalert2'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Plugincard.css";

/*
* This component represents the plugin cards. This compenent is
* a child of Plugin Picker. Once drag and drop is implemented 
* we capture the id of a clicked plugin and send that id to the parent
* App.js
*/ 
let pluginModule = require('../Model');

async function getPort (id) {
  const {value: text} = await Swal.fire({
    title: 'Current Port: ' + store.getState().currProject.plugins[id].port,
    input: 'textarea',
    inputPlaceholder: 'Custom Port',
    showCancelButton: true,
    allowEnterKey:	true,
  })
  return text;
}

class DraggablePlugins extends React.Component {
  handleClick = e => { 
    e.preventDefault();
    store.dispatch(setCurrPopupID(e.currentTarget.dataset.id));
    if(this.props.visibility === 'hidden') {
      this.props.handlerFromParent(e.currentTarget.dataset.id);
    } else {
      (async () => {
        let port = await getPort(e.currentTarget.dataset.id);
        if(!port) return;
        if(port.length > 4){ 
          port = port.substring(0, 3) + '...'
          Swal.fire("Ports larger than 4 characters will be truncated!")
        }
        pluginModule.project.plugins[store.getState().currPopupID].port = port;
        console.log(pluginModule.project.plugins[store.getState().currPopupID].port)
      })()
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