// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Plugincard.css";

import store from '../../redux/store/index';
import { setCurrPopupID } from "../../redux/actions/index";

/***************************************************************
* This component defines the logic of how the plugin picker and 
* the plugin palette interface as well as which selectable
* plugins are within which view.
* 
* PluginApp.js --> PluginPicker.js    --> SelectablePlugins.js or
*              --> PluginPalette.js   --> SelectablePlugins.js
****************************************************************/

let pluginModule = require('../Model');

class SelectablePlugins extends React.Component {
  /*
  ================================
  Handler Functions
  ================================
  */
  clickedPluginHandler = (event) => { 
    event.preventDefault();
    store.dispatch( setCurrPopupID(event.currentTarget.dataset.id) );
    if(this.props.sentInImage === '/images/custom.png' && this.props.sentInVisibilty === 'visible') {
      customPluginPopup(this.props.sentInPluginName)
    } else if(this.props.sentInVisibilty === 'hidden'){
      this.props.selectedPluginHandlerFromParent(event.currentTarget.dataset.id);
    } else {
      setPort(event);
    }
  }

  changePluginSelectionHandler = (event) => {
    event.stopPropagation();
    this.props.selectedPluginHandlerFromParent(event.currentTarget.dataset.id);
  }
  
  /*
  ================================
  Render
  ================================
  */
  render() {
    return ( 
      <div className="cardbody" data-id={this.props.sentInID} onClick={this.clickedPluginHandler}>
        <div className="img-holder">
          <div>
            <img 
              className="main-img" 
              src={window.location.origin + this.props.sentInImage}
              alt='main'
            ></img>
            <img 
              className="close-img" 
              src={'/images/close.png'}
              alt='close'
              data-id={this.props.sentInID}
              style={{visibility: this.props.sentInVisibilty}}
              onClick={this.changePluginSelectionHandler}
            ></img>
          </div>
          <div>
            <p className="cardtext">{this.props.sentInPluginName}</p>
          </div>
        </div>
      </div>
    );
  }
};
export default SelectablePlugins;

SelectablePlugins.propTypes = {
  sentInPluginName:                  PropTypes.string.isRequired,
  sentInImage:                       PropTypes.string.isRequired,
  selectedPluginHandlerFromParent:   PropTypes.func.isRequired,
  sentInID:                          PropTypes.number.isRequired,
  sentInVisibilty:                   PropTypes.string.isRequired
}

/*
================================
Helper Functions
================================
*/
// Displays the port popup for the specific plugin the user clicked
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

// Allow the user to set the port through a swal2 popup.
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

// Allows the user to delete the selected custom plugin
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