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
import PropTypes from 'prop-types';
import 'chai/register-expect';
import Swal from 'sweetalert2'
import ContentEditable from 'react-contenteditable'
import ReactTooltip from 'react-tooltip'
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Dropdown from './Dropdown';
import '../../../styles_CSS/Plugin/Header/Header.css';

import store from '../../../redux/store/index';
import { addCurrProject, saveProjectToKV, loadProjectFromKV, generateCurrProject } from "../../../redux/actions/index";

let pluginModule = require('../../Model');

/***************************************************************
* This component represents the header for the plugin app. It 
* contains all project configuration functionality.
*
* PluginApp.js --> PluginAppHeader.js
****************************************************************/

class PluginAppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedName: ' '
    };
    this.saveCurrentProjectHandler = this.saveCurrentProjectHandler.bind(this);
    this.loadCurrentProjectHandler = this.loadCurrentProjectHandler.bind(this);
    this.generateCurrentProjectHandler = this.generateCurrentProjectHandler.bind(this);
    this.resetProjectStateHandler = this.resetProjectStateHandler.bind(this);
    this.sendLoadedProjectHandler = this.sendLoadedProjectHandler.bind(this);
    this.editedProjectNameHandler = this.editedProjectNameHandler.bind(this);
  }

  /*
  ================================
  Handler Functions
  ================================
  */
  saveCurrentProjectHandler() {
    const projectCopy = JSON.parse(JSON.stringify( store.getState().currProject ));
    let projectCopyName = projectCopy.projectName;
    let isDuplicateName = determineIfDuplicate(projectCopyName);  

    // Their project name was found to be unique, so we save.
    if(!isDuplicateName) {
      store.dispatch( addCurrProject([projectCopy]));
      successfulSaveToast();

    // Their project name was found to already exist, so we rename.
    } else {
      store.dispatch( addCurrProject([projectCopy]));  

      // While the project name still exists...
      while(determineIfDuplicate(projectCopyName)) {
        projectCopyName = makeUniqueAgain(projectCopyName);
      }
      syncProjectNameState(projectCopyName);
      successfulRenameToast();
    }

    // Save project to redux.
    this.props.newProjectNameHandlerFromPluginApp(projectCopyName)
    store.dispatch( saveProjectToKV(store.getState().currProject) )
  }

  loadCurrentProjectHandler() {
    store.dispatch( loadProjectFromKV(store.getState().currProject.projectName) );
  }

  generateCurrentProjectHandler() {
    store.dispatch( generateCurrProject(store.getState().currProject) );
  }

  editedProjectNameHandler = evt => {
    let editedProjectName = evt.target.value;
    store.getState().currProject.projectName = editedProjectName;
    pluginModule.project.projectName = editedProjectName;
    this.props.newProjectNameHandlerFromPluginApp(editedProjectName)
  };

  resetProjectStateHandler = () => {
    this.props.newProjectCreationHandlerFromPluginApp();
  }

  sendLoadedProjectHandler = (name) => {
    this.props.loadedProjectHandlerFromPluginApp(name);
  }

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <div>
        <Segment>
          {/* Defines the grid to contains all the buttons and dropdown */}
          <Grid columns={1} relaxed='very'>
            <Grid.Column className="header-column-plugin"  >
              {/* Renders the cisco logo */}
              <div className="cisco-logo-div">
                <img
                  className="cisco-logo"
                  src='/images/cisco-logo.png'
                  alt='oops'
                  onClick={this.resetProjectStateHandler}>
                </img>
              </div>
              {/* Renders the dropdown */}
              <Dropdown
                className="new-project-link"
                loadedProjectHandlerFromPluginAppHeader={this.sendLoadedProjectHandler}
              />
              {/* Renders the '+' add image */}
              <img
                className="new-project-image"
                src='/images/new-project.png'
                alt='oops'
                onClick={this.resetProjectStateHandler}
                data-tip="New Project">
              </img>
              {/* Renders the project name */}
              <div className="header-text">
                <p className="currentproject">Current Project: </p>
                <ContentEditable
                  spellCheck={false}
                  className="projectname"
                  html={this.props.currentProjectNameFromPluginApp}
                  disabled={false} 
                  onChange={this.editedProjectNameHandler} 
                />
              </div>
              {/* Renders the Button Link */}
              <Link className="generatorlink" onClick={this.generateCurrentProjectHandler} to="/GeneratorApp">Generate</Link>
              {/* Renders the upload image for saving projects */}
              <img
                className="upload-image"
                src='/images/upload.png'
                alt='oops'
                onClick={this.saveCurrentProjectHandler}
                data-tip="Upload Project">
              </img>
            </Grid.Column>
          </Grid>
          <Divider vertical></Divider>
        </Segment>
        {/* Creates an on hover tooltip using the ReactToolTip library */}
        <ReactTooltip
          place="bottom"
          effect="solid"
        />
      </div>
    );
  }
}
export default PluginAppHeader;

PluginAppHeader.propTypes = {
  newProjectCreationHandlerFromPluginApp:   PropTypes.func.isRequired,    
  newProjectNameHandlerFromPluginApp:       PropTypes.func.isRequired,
  loadedProjectHandlerFromPluginApp:        PropTypes.func.isRequired,
  currentProjectNameFromPluginApp:    PropTypes.string.isRequired
}

/*
================================
Helper Functions
================================
*/
// Search through all existing project names
// to determine a match. Return true if a match is found.
function determineIfDuplicate(projectName) {
  let isDuplicate;
  for(let i = 0; i < store.getState().projects.length; i++) {
    if(projectName === store.getState().projects[i].projectName) {
      isDuplicate = true;
      return isDuplicate;
    } 
  }
  return isDuplicate = false;
}

// Will make the duplicatedName unique again by adding 
// a unique identifier (#) to the end of the project name.
function makeUniqueAgain(projectName) {
  const regexIdentifier = /\([0-9]+\)/;
  const regexNumber = /[0-9]+/;
  if(projectName.match(regexIdentifier)) {
    let nthDuplicate = Number(projectName.match(regexNumber)[0]);
    let matchSize = projectName.match(regexIdentifier)[0].length;

    projectName = projectName.slice(0,-matchSize)
    projectName = projectName + '(' + (nthDuplicate+1) + ')'
  } else {
    projectName = projectName + '(1)';
  }
  return projectName;
}

// Takes project name and update local and redux project
// name state.
function syncProjectNameState(projectName) {
  if(store.getState().projects[store.getState().projects.length-1]) {
    store.getState().projects[store.getState().projects.length-1].projectName = projectName;
  }
  store.getState().currProject.projectName = projectName;
  pluginModule.project.projectName = projectName;
}


// Presents a toast indicating a successful save.
// This means their project name was found to be unique.
function successfulSaveToast() {
  const savedToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
  })
  savedToast.fire({
    type: 'success',
    title: '"' + pluginModule.project.projectName + '" saved successfully',
  })
}

// Presents a toast indicating their project was renamed and saved
// This means their picked name was found to already exist.
function successfulRenameToast() {
  const savedToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
  })
  savedToast.fire({
    type: 'warning',
    title: 'Warning!',
    text: 'Another project under this name already exists! Your project will be renamed: "' 
          + pluginModule.project.projectName + '"',
  })
}
