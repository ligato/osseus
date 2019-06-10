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

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Tree from './Tree';
import "../../../styles_CSS/Generator/GeneratorApp.css";

// FileExplorer Globals
const StyledFileExplorer = styled.div`
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;  
  padding: 10px;
`;

const TreeWrapper = styled.div`
  width: 250px;
`;

/**********************************************************************
* This component defines the tree structure of the file structure.
* 
* GeneratorApp.js --> CodeStructure.js --> FileExplorer.js --> Tree.js
***********************************************************************/

class FileExplorer extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      currentFile: '',
    };

  }

  /*
  ================================
  Handler Functions
  ================================
  */
  onNodeSelectHandler = (file) => { 
    this.setState({
      currentFile: file.content.fileName
    });
    this.props.onNodeSelectHandlerFromCodeStructure(file);
  };

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <div>
        <div className="current-file-div">
          <span className="current-file-heading">Current File:</span>
          <span className="current-file-text">{this.state.currentFile}</span>
        </div>
        <StyledFileExplorer>
          <TreeWrapper>
            <Tree 
              onNodeSelectHandlerFromFileExplorer={this.onNodeSelectHandler} 
              templateFromFileExplorer={this.props.templateFromCodeStructure}
              loading={this.props.loading}
            />
          </TreeWrapper>
        </StyledFileExplorer>

      </div>
    )
  }
}
export default FileExplorer

FileExplorer.propTypes = {
  onNodeSelectHandlerFromCodeStructure: PropTypes.func.isRequired,   
}