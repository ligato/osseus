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
import "../../styles_CSS/Plugin/Splitright.css";

// PluginPalette globals
let pluginModule = require('../Model');
let textVisibilty = 'visible';
const toolText = {
  generate: 'Once finished, generate a template.',
  header: 'Configure and save projects.',
  pluginPicker: 'Pick from a set of plugins or make your own.',
  agent: 'Choose agent settings.'
}

/***************************************************************
* This component defines the logic of how the plugin picker and 
* the plugin palette interface as well as which selectable
* plugins are within which view.
* 
* PluginApp.js --> PluginPicker.js    --> SelectablePlugins.js
*              --> PluginPalette.js   --> SelectablePlugins.js
*              --> PluginAppHeader.js --> Dropdown.js
****************************************************************/

const PluginPalette = (props) => {
  var pluginArray = React.Children.toArray(props.children);
  
  // Loop through to find out which plugins are not in the plugin picker. 1 = in plugin picker.
  for(let i = props.sentInArray.length; i >= 0; i--) {
    if(props.sentInArray[i] === 0 || props.sentInArray[i] === false) { pluginArray.splice(i,1); }
  }
  if(props.sentInArray.includes(1)) textVisibilty = 'hidden';
  else textVisibilty = 'visible';

  /*
  ================================
  Render
  ================================
  */
  return (
    <div>
      <div >
        <div className="split right">
          <div className="grid-div">
            <div className="grid-container-right">
              {pluginArray}
            </div>
          </div>
          {/* Renders the help text if there are no plugins selected */}
          <div className="tool-text-container" style={{visibility: textVisibilty}}>
            <p className="tool-text-header">{toolText.generate}&emsp;<i className="up-arrow"></i></p>
            <div className="tool-text-div">
              <p className="tool-text"><i className="up-arrow"></i>&emsp;{toolText.header}</p><br></br>
              <p className="tool-text"><i className="left-arrow"></i>&emsp;{toolText.pluginPicker}</p><br></br>
              <p className="tool-text"><i className="down-arrow"></i>&emsp;{toolText.agent}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Renders the bottom agent box along with it configuration button */}
      <div className="split right-bottom">
        <div className="rectangle">
          <img
            className="settings-image"
            src='/images/settings.png'
            alt='oops'
            data-tip="Agent Settings"
            onClick={handleNewAgentName}>
          </img>
          <div className="agent-text">
            <p className="agent-name">Agent</p>
          </div>
        </div>
        {/* Renders the cisco logo if the window width is less than 1400px
        this logic exists in Splitright.css */}
        <img
          className="cisco-logo-gray"
          src='/images/cisco-logo.png'
          alt='oops'>
        </img>
      </div>
    </div>
  );
};
export default PluginPalette;

PluginPalette.propTypes = {
  sentInArray:   PropTypes.array.isRequired,
}

/*
================================
Helper Functions
================================
*/
// Shows an agent name configuration using a swal2 (popup library) popup.
function handleNewAgentName() {
  (async () => {
    let nameCapture = await getAgentName();
    if(!nameCapture) return;
    pluginModule.project.agentName = nameCapture[0];
    console.log(pluginModule.project.agentName)
  })()
}

// Return the agent name from the popup
async function getAgentName () {
  const inputStyling = `<div style="display:inline-block; width: 300px;">
                          <p style="float: left; width: 100px; margin-bottom: -15px;">Agent Name:</p>
                          <input style="float: left; width: 300px; margin-top: 20px;" id="swal-input1" value="${pluginModule.project.agentName}">
                        </div>`
  const {value: formValues} = await Swal.fire({
    showCancelButton: false,
    width: '24rem',
    position: 'bottom',
    heightAuto: 'false',
    allowEnterKey: true,
    showCloseButton: true,
    html: inputStyling,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
      ]
    }
  })
  return formValues;
}