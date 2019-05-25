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

class DraggablePlugins extends React.Component {
  //Function will either move the plugin into the plugin palette, or
  //bring up the port popup.
  handleClick = (event) => { 
    event.preventDefault();
    store.dispatch( setCurrPopupID(event.currentTarget.dataset.id) );
    if(this.props.image === '/images/custom.png' && this.props.visibility === 'visible') {
      console.log('custom')
      customPluginPopup(this.props.pluginName)
    } else if(this.props.visibility === 'hidden'){
      this.props.handleClickedPlugin(event.currentTarget.dataset.id);
    } else {
      setPort(event);
    }
  }

  //Function will remove the plugin from the plugin palette.
  handleRemovePluginClick = (event) => {
    event.stopPropagation();
    this.props.handleClickedPlugin(event.currentTarget.dataset.id);
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
              onClick={this.handleRemovePluginClick}
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
  pluginName:           PropTypes.string.isRequired,
  image:                PropTypes.string.isRequired,
  handleClickedPlugin:  PropTypes.func.isRequired,
  id:                   PropTypes.number.isRequired,
  visibility:           PropTypes.string.isRequired
}

//Function load the port for the specific plugin the user clicked
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

//Function allow the user to set the port through a popup
function setPort(event) {
  (async () => {
    let port = await getPort(event.currentTarget.dataset.id);
    if(!port) return;
    if(port.length > 4){ 
      port = port.substring(0, 3) + '...'
      Swal.fire("Ports larger than 4 characters will be truncated!")
    }
    pluginModule.project.plugins[store.getState().currPopupID].port = port;
  })()
}

function customPluginPopup(name) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
  })
  
  swalWithBootstrapButtons.fire({
    title: '"' + name + '" Plugin Information',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Delete Plugin',
    showCloseButton: true,
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    } 
  })
}