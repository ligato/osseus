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

import React from 'react'
import 'chai/register-expect';
import Swal from 'sweetalert2'

import PluginPicker from './PluginPicker';
import SelectablePlugins from './SelectablePlugins';
import PluginPalette from './PluginPalette';
import PluginAppHeader from './Header/PluginAppHeader';

import store from '../../redux/store/index';
import { setCurrProject } from "../../redux/actions/index";

// PluginApp globals
let pluginModule = require('../Model');
store.dispatch( setCurrProject(pluginModule.project) );

let deselectButtonVisibility;
let OFFSET = buildOFFSET();

let customPlugin = {
  pluginName: 'UNTITLED',
  selected: false,
  packageName: 'untitled',
}

/***************************************************************
* This component defines the logic of how the plugin picker and 
* the plugin palette interface as well as which selectable
* plugins are within which view.
* 
* PluginApp.js --> PluginPicker.js    --> SelectablePlugins.js or
*              --> PluginPalette.js   --> SelectablePlugins.js
*              --> PluginAppHeader.js --> Dropdown.js
****************************************************************/

class PluginApp extends React.Component {
  constructor() {
    super();
    this.state = {
      sentInCategories: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.', 'Custom'], 
      pluginPickedArray: getPluginsSelected(),
      currentProjectName: store.getState().currProject.projectName,
    };
    this.handlePluginSelection = this.handlePluginSelection.bind(this);
    this.handleNewProjectCreation = this.handleNewProjectCreation.bind(this);
    this.handleLoadedProjectFromDropdown = this.handleLoadedProjectFromDropdown.bind(this);
    this.handleNewProjectName = this.handleNewProjectName.bind(this);
    this.handleCustomPluginCreation = this.handleCustomPluginCreation.bind(this);
    deselectButtonVisibility = determineDeselectButtonVisibility(this.state.pluginPickedArray)
  }
    
  /*
  ================================
  Handler Functions
  ================================
  */
  handlePluginSelection = (index) => {
    let tempArray = this.state.pluginPickedArray;
    tempArray[index] = !tempArray[index]*1;
    this.setState({
      pluginPickedArray: tempArray
    });
    pluginModule.project.plugins[index].selected = !pluginModule.project.plugins[index].selected;
    if(this.state.pluginPickedArray[index] === 0) {
      deselectButtonVisibility[index] = 'hidden';
    } else {
      deselectButtonVisibility[index] = 'visible';
    }
    store.dispatch( setCurrProject(pluginModule.project));
  }

  handleNewProjectCreation = () => {
    (async () => {
      let nameCapture = await getNewProjectName();
      if(!nameCapture) return;
      this.setState({
        currentProjectName: nameCapture
      });
      pluginModule.project.projectName = nameCapture;
    })()
    resetAppState();
    this.setState({
      pluginPickedArray: getPluginsSelected()
    });
  }

  handleLoadedProjectFromDropdown(name) {
    var selectedArray = getPluginsSelected()
    this.setState({
      pluginPickedArray: selectedArray,
      currentProjectName: name
    });
    deselectButtonVisibility = determineDeselectButtonVisibility(selectedArray)
  }

  handleNewProjectName(name) {
    this.setState({
      currentProjectName: name
    });
  }

  handleCustomPluginCreation(name) {
    let plugin = JSON.parse(JSON.stringify(customPlugin));
    plugin.pluginName = name[0];
    plugin.packageName = name[1];
    buildCustomPlugin(plugin);
    this.setState({
      pluginPickedArray: getPluginsSelected()
    });
    OFFSET = buildOFFSET();
  }

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <div>
        {/* Renders the header */}
        <PluginAppHeader
          newProjectHandlerFromParent={this.handleNewProjectCreation}
          newProjectNameHandlerFromParent={this.handleNewProjectName}
          loadedProjectHandlerFromParent={this.handleLoadedProjectFromDropdown}
          sentInCurrentProjectName={this.state.currentProjectName}
        />
        <div className="left-column-background"></div>
          <div className="plugin-column">
            {/* Maps over each category to render each category's plugins */}
            {this.state.sentInCategories.map((sentInCategory, outerIndex) => {
              return (
                <PluginPicker 
                  key={outerIndex} 
                  sentInCategory={sentInCategory} 
                  sentInPlugins={this.state.pluginPickedArray.slice(Number(OFFSET[outerIndex]),Number(OFFSET[outerIndex+1]))}
                  sendCustomPlugin={this.handleCustomPluginCreation}
                >
                  {/* Maps over all the plguins within a category to render the plugins within that category */}
                  {pluginModule.project.plugins.slice(Number(OFFSET[outerIndex]), Number(OFFSET[outerIndex+1])).map((i, innerIndex) => {
                    return (
                      <SelectablePlugins
                        sentInPluginName={pluginModule.project.plugins[Number(OFFSET[outerIndex]) + innerIndex].pluginName}
                        sentInImage={pluginModule.images[Number(OFFSET[outerIndex]) + innerIndex]}
                        selectedPluginHandlerFromParent={this.handlePluginSelection}
                        sentInID={Number(OFFSET[outerIndex]) + innerIndex}
                        key={Number(OFFSET[outerIndex]) + innerIndex} 
                        sentInVisibilty={deselectButtonVisibility[Number(OFFSET[outerIndex]) + innerIndex]}
                      />
                    )
                  })}     
                </PluginPicker>
              )
            })}
          </div>
          {/* Render the plugin palette, where selected plugins show. */}
          <PluginPalette 
            sentInArray={this.state.pluginPickedArray}
          >
            {/* Maps over all the plugins rendering all the plugins that are selected */}
            {pluginModule.project.plugins.map((i, index) => {
              return (
                <SelectablePlugins
                  sentInPluginName={pluginModule.project.plugins[index].pluginName}
                  sentInImage={pluginModule.images[index]}
                  selectedPluginHandlerFromParent={this.handlePluginSelection}
                  sentInID={index}
                  key={index}
                  sentInVisibilty={deselectButtonVisibility[index]}
                />
              )
            })}   
          </PluginPalette>
      </div>
    );
  }
}
export default PluginApp;

/*
================================
Helper Functions
================================
*/
// Gets the name of a new project using a swal2 (popup library) popup.
async function getNewProjectName () {
  const {value: text} = await Swal.fire({
    title: 'CN-infra Generator App',
    input: 'textarea',
    inputPlaceholder: 'New Project Name',
    showCancelButton: true,
    allowEnterKey:	true,
  })
  return text;
}

// Resets the state of the app when the user creates a new project.
function resetAppState() {
  pluginModule.project.plugins.length = 16;
  pluginModule.project.customPlugins = [];
  for(let i = 0; i < pluginModule.project.plugins.length; i++) {
    pluginModule.project.plugins[i].selected = false;
    pluginModule.project.plugins[i].port = 0;
  }
  store.dispatch( setCurrProject(pluginModule.project));
  deselectButtonVisibility = determineDeselectButtonVisibility(getPluginsSelected())
}

// Determines the plugins selected.
function getPluginsSelected() {
  let selectedArray = store.getState().currProject.plugins;
  let array = [];
  for(let i = 0; i < selectedArray.length; i++) {
    if(selectedArray[i].selected) array.push(Number(1))
    else array.push(Number(0)) 
  }
  return array;
}

// Determines whether or not to render a close button based on if the 
// plugin is selected or not. If the plugin is selected, render a deselect
// button, else, don't.
function determineDeselectButtonVisibility(sentInArray) {
  var array = [];
  for(let i = 0; i < sentInArray.length; i++) {
    if(sentInArray[i] === 0) {
      array[i] = 'hidden';
    } else {
      array[i] = 'visible';
    }
  }
  return array;
}

// Builds an offset array in order to render a plugin within its given category 
// heading, ie. there are 3 RPC plugins under the RPC heading so the the RPC
// plugins offset the whole plugin array by 3 in order to determine where the
// plugins under the next heading starts.
function buildOFFSET() {
  let array = [[0]];
  var previouslength = 0;
  for(let i = 0; i < pluginModule.categories.length; i++) {
    let subarray = [pluginModule.categories[i].length + previouslength]
    array.push(subarray)
    previouslength = Number(array[i+1]);
  }
  return array;
}

// Helps create a new custom plugin.
function buildCustomPlugin(data) {
  deselectButtonVisibility.push('hidden');
  pluginModule.images.push('/images/custom.png');
  pluginModule.project.customPlugins.push(data)
  pluginModule.project.plugins.push(data)
  pluginModule.categories[5].push([data.pluginName, 'CUSTOM'])
  store.dispatch( setCurrProject(pluginModule.project));
}
