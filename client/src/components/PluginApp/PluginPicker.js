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
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'

import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitleft.css";

/***************************************************************
* This component represents the left webpage division where the
* plugins will reside initially. 
*
* PluginApp.js --> PluginPicker.js
****************************************************************/

const PluginPicker = (props) => {
  var pluginArray = React.Children.toArray(props.children);

  // Loop through to find out which plugins are not in the plugin picker. 1 = not in plugin picker.
  for(let i = props.pluginsFromPluginApp.length; i >= 0; i--) {
    if(props.pluginsFromPluginApp[i] === 1 || props.pluginsFromPluginApp[i] === true) { pluginArray.splice(i,1); }
  }

  /*
  ================================
  Helper Function
  ================================
  */
  // Handles custom heading or '+' image click to create a custom plugin.
  function handleHeadingClick(heading) {
    if(heading === 'Custom') {
      (async () => {
        let customPluginData = await getCustomPluginName();
        if(!customPluginData) return;
        props.customPluginCreationHandlerFromPluginApp(customPluginData);
      })()
    }
  }
 
  /*
  ================================
  Render
  ================================
  */
  return (
    <div className="body">
      {/* Renders the custom plugin heading as well as all existing plugins */}
      <p 
        className={props.categoryFromPluginApp === 'Custom' ? "custom-heading":"pluginheadingtext"} 
        onClick={() => {handleHeadingClick(props.categoryFromPluginApp)}}>
          {props.categoryFromPluginApp}
      </p>
      {props.categoryFromPluginApp === 'Custom' ? 
        <img
          className="add-plugin-image"
          src='/images/add.png'
          alt='oops'
          onClick={() => {handleHeadingClick('Custom')}}
          data-tip="New Plugin">
        </img>
        : null
      }

      {/* Renders all other headings and the default plugins */}
      <div className="grid-container" style={{borderColor : (props.categoryFromPluginApp === 'Custom' ? "white" : "#CECECE")}}>
        {pluginArray}
      </div>

      {/* Creates an on hover tooltip using the ReactToolTip library */}
      <ReactTooltip
        place="bottom"
        effect="solid"
      />
    </div>
  );
};
export default PluginPicker;

PluginPicker.propTypes = {
  categoryFromPluginApp:                       PropTypes.string.isRequired,
  pluginsFromPluginApp:                        PropTypes.array.isRequired,
  customPluginCreationHandlerFromPluginApp:    PropTypes.func.isRequired
}

/*
================================
Handler Functions
================================
*/
// Gets the name and the package of a new custom plugin
// using a swal2 (popup library) popup.
async function getCustomPluginName () {
  const {value: formValues} = await Swal.fire({
    title: 'Custom Plugin',
    html:
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Name:</p><input style="float:right; width: 300px" id="swal-input1"></div>' +
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Package:</p><input style="float:right; width: 300px" id="swal-input2"></div>',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value.toUpperCase(),
        document.getElementById('swal-input2').value
      ]
    }
  })
  return formValues;
}
