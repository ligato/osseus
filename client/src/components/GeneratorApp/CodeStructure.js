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

import FileExplorer from './FileExplorer/FileExplorer';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

/**********************************************************************
* This component defines the left split of the generator app page.
* 
* GeneratorApp.js --> CodeStructure.js --> FileExplorer.js --> Tree.js
***********************************************************************/
 
class CodeStructure extends React.Component {

  /*
  ================================
  Handler Function
  ================================
  */
  onNodeSelectHandler = (file) => { 
    this.props.onNodeSelectHandlerFromGeneratorApp(file);
  };

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <div className="body">
        <div className="split left">
          <div className="filestructure"> 
            <FileExplorer 
              onNodeSelectHandlerFromCodeStructure={this.onNodeSelectHandler} 
              templateFromCodeStructure={this.props.templateFromGeneratorApp}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default CodeStructure;

CodeStructure.propTypes = {
  onNodeSelectHandlerFromGeneratorApp:      PropTypes.func.isRequired,   
}
