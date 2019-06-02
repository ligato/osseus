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
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import '../../../styles_CSS/Generator/Header/Header.css';

import store from '../../../redux/store/index';
import { addCurrProject, saveProjectToKV, downloadTar } from "../../../redux/actions/index";

let pluginModule = require('../../Model');

/***************************************************************
* This component represents the header for the generator app. It 
* contains downloading and back page functionality.
* 
* GeneratorApp.js --> Header.js
****************************************************************/

class GeneratorAppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedName: ' '
    };
    this.saveProjectHandler = this.saveProjectHandler.bind(this);
    this.downloadTarHandler = this.downloadTarHandler.bind(this);
    this.editedProjectNameHandler = this.editedProjectNameHandler.bind(this);
  }

  /*
  ================================
  Handler Functions
  ================================
  */
  saveProjectHandler() {
    const projectCopy = JSON.parse(JSON.stringify(store.getState().currProject));
    let projectCopyName = projectCopy.projectName;
    let isDuplicateName = determineIfDuplicate(projectCopyName);
    //Their project name was found to be unique
    if (!isDuplicateName) {
      store.dispatch(addCurrProject([projectCopy]));
      successfulSaveToast();
      //Their project name was found to already exist
    } else {
      store.dispatch(addCurrProject([projectCopy]));
      //Executes while project identifier number for project name is taken    
      while (determineIfDuplicate(projectCopyName)) {
        projectCopyName = makeUniqueAgain(projectCopyName);
      }
      syncProjectNameState(projectCopyName);
      successfulRenameToast();
    }
    this.props.newProjectNameHandlerFromParent(projectCopyName);
    store.dispatch(saveProjectToKV(store.getState().currProject));
  }

  async downloadTarHandler() {
    store.dispatch( downloadTar(store.getState().currProject) )
    await new Promise(resolve => { setTimeout(resolve, 1000);})
    const link = document.createElement('a');
    link.href = `/template/template.tgz`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  editedProjectNameHandler = evt => {
    let editedProjectName = evt.target.value;
    store.getState().currProject.projectName = editedProjectName;
    pluginModule.project.projectName = editedProjectName;
    this.props.newProjectNameHandlerFromParent(editedProjectName)
  };

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <Segment>
        <Grid columns={1} relaxed='very'>
          <Grid.Column className="header-column-gen"  >
            {/* Defines the back button to go back */}
            <Link to="/">
              <img
                className="back-image"
                src='/images/back.png'
                alt='oops'>
              </img>
            </Link>
            <div className="headergentext">
              {/* Renders the project name */}
              <p className="current-project">Current Project: </p>
              <ContentEditable
                spellCheck={false}
                className="project-name"
                html={this.props.sentInCurrentProjectName}
                disabled={false}
                onChange={this.editedProjectNameHandler}
              />
            </div>
            {/* Anchor tag points the client to the download location */}
            <div onClick={this.downloadTarHandler}>
              {/* If the downloadable tar exists then display a regular download, otherwise
              display a grayed out download image */}
              <img
                className={this.props.sentInDownloadable ? "download-image" : 'download-gray-image'}
                src={this.props.sentInDownloadable ? '/images/download.png' : '/images/download_gray.png'}
                alt='oops'>
              </img>
            </div>
          </Grid.Column>
        </Grid>
        <Divider vertical></Divider>
      </Segment>
    );
  }
}
export default GeneratorAppHeader;

GeneratorAppHeader.propTypes = {
  newProjectNameHandlerFromParent:   PropTypes.func.isRequired,    
  sentInCurrentProjectName:          PropTypes.string.isRequired,
  sentInDownloadable:                PropTypes.bool.isRequired,
}

/*
================================
Helper Functions
================================
*/
//Function will search through all existing project names
//to determine a match. Return true if a match is found.
function determineIfDuplicate(projectName) {
  let isDuplicate;
  for (let i = 0; i < store.getState().projects.length; i++) {
    if (projectName === store.getState().projects[i].projectName) {
      isDuplicate = true;
      return isDuplicate;
    }
  }
  return isDuplicate = false;
}

//Function will make the duplicatedName unique again by adding 
//a unique identifier (#) to the end of the project name.
function makeUniqueAgain(projectName) {
  const regexIdentifier = /\([0-9]+\)/;
  const regexNumber = /[0-9]+/;
  if (projectName.match(regexIdentifier)) {
    let nthDuplicate = Number(projectName.match(regexNumber)[0]);
    let matchSize = projectName.match(regexIdentifier)[0].length;

    projectName = projectName.slice(0, -matchSize)
    projectName = projectName + '(' + (nthDuplicate + 1) + ')'
  } else {
    projectName = projectName + '(1)';
  }
  return projectName;
}

//Function will take project name and update local and redux project
//name state.
function syncProjectNameState(projectName) {
  if (store.getState().projects[store.getState().projects.length - 1]) {
    store.getState().projects[store.getState().projects.length - 1].projectName = projectName;
  }
  store.getState().currProject.projectName = projectName;
  pluginModule.project.projectName = projectName;
}


//Function will present a toast indicating a successful save.
//This means their project name was found to be unique.
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

//Function will present a toast indicating their project was renamed and saved
//This means their picked name was found to already exist.
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

