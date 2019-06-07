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

import CodeStructure from './CodeStructure';
import CodeViewer from './CodeViewer';
import GeneratorAppHeader from './Header/GeneratorAppHeader';

import "../../styles_CSS/Generator/GeneratorApp.css";

import store from '../../redux/store/index';

/*************************************************************************
* This component defines the logic of how the Code Viewer and 
* the code structure interface.
* 
* GeneratorApp.js --> CodeStructure.js      --> FileExplorer.js -->
*                                               Tree.js         -->
*                                               TreeNode.js
*                                                
*                 --> CodeViewer.js      
*                 --> GeneratorAppHeader.js --> Dropdown.js
*************************************************************************/

class GeneratorApp extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProjectName: store.getState().currProject.projectName,
      selectedFile: ' ',
      loading: false,
      downloadable: true,
      template: null,
      showToolText: true
    };
    this.newProjectNameHandler = this.newProjectNameHandler.bind(this);
    this.onNodeSelectHandler = this.onNodeSelectHandler.bind(this);
  }

  // On component mount, the loader will be rendered and promise is made and resolved
  // in .5 seconds, then the template will be retrieved from the model. 
  async componentDidMount() {
    //Setting the loader on
    this.setState({ loading: true });

    //setTimeout = .5 seconds
    await new Promise(resolve => { setTimeout(resolve, 500); })

    //Get the template from the model
    let template = getTemplate()
    if (template !== '') {
      this.setState({
        loading: false,
        template: template,
      });
    }
    return Promise.resolve();
  }

  /*
  ================================
  Handler Functions
  ================================
  */
  newProjectNameHandler(projectName) {
    this.setState({
      currentProjectName: projectName
    });
  }

  onNodeSelectHandler = (file) => {
    if (file.type === 'file') {
      this.setState({
        selectedFile: file.content.content,
        showToolText: false
      })
    }
  }

  /*
  ================================
  Render
  ================================
  */
  render() {
    if (this.state.loading) {
      return (
        <div>
          {/* Renders the loader if loading is true. Meaning the template DNE yet */}
          <GeneratorAppHeader
            newProjectNameHandlerFromGeneratorApp={this.newProjectNameHandler}
            currentProjectNameFromGeneratorApp={this.state.currentProjectName}
            downloadableFromGeneratorApp={this.state.downloadable}
          />
          <div className="loader-div">
            <div className="loader" />
          </div>
        </div>
      )
    }
    return (
      <div>
        {/* Renders the regular view of the file and code structure */}
        <GeneratorAppHeader
          newProjectNameHandlerFromGeneratorApp={this.newProjectNameHandler}
          currentProjectNameFromGeneratorApp={this.state.currentProjectName}
          downloadableFromGeneratorApp={this.state.downloadable}
        />
        <CodeStructure
          onNodeSelectHandlerFromGeneratorApp={this.onNodeSelectHandler}
          templateFromGeneratorApp={this.state.template}
        />
        <CodeViewer
          generatedCodeFromGeneratorApp={this.state.selectedFile}
          shownToolTextFromGeneratorApp={this.state.showToolText}
        />
      </div>
    )
  }
}

export default (GeneratorApp);

/*
================================
Helper Function
================================
*/
function getTemplate() {
  return store.getState().template;
}

