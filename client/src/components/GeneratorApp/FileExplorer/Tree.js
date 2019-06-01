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
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

//Tree.js Globals
let i = 0
let data = {};

/**********************************************************************
* This component defines the logic of the file structure.
* 
* GeneratorApp.js --> CodeStructure.js --> FileExplorer.js --> Tree.js
***********************************************************************/

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: data,
    };
    if((this.props.sentInTemplateFromFileExplorer !== null && 
    this.props.sentInTemplateFromFileExplorer !== ' ')) {
      buildTemplateDataObject(this.props.sentInTemplateFromFileExplorer);
    }
  }

   
  getRootNodes = () => {
    const { nodes } = this.state;
    return values(nodes).filter(node => node.isRoot === true);
  }

  getChildNodes = (node) => {
    const { nodes } = this.state;
    if (!node.children) return [];
    return node.children.map(path => nodes[path]);
  }  

  /*
  ================================
  Handler Functions
  ================================
  */
  onToggleHandler = (node) => {
    if(node.type === 'folder') {
      const { nodes } = this.state;
      nodes[node.path].isOpen = !node.isOpen;
      this.setState({ nodes });
    } else {
      let sendNode = JSON.parse(JSON.stringify(node));
      this.props.onParentSelectHandlerFromFileExplorer(sendNode);
    }
  }

  onNodeSelectHandler = node => {
    let sendNode = JSON.parse(JSON.stringify(node));
    this.props.onParentSelectHandlerFromFileExplorer(sendNode);
  }

  /*
  ================================
  Render
  ================================
  */
  render() {
    const rootNodes = this.getRootNodes();
    return (
      <div>
        { rootNodes.map(node => (
          <TreeNode 
            node={node}
            getChildNodes={this.getChildNodes}
            onToggleHandlerFromParent={this.onToggleHandler}
            key={i++}
          />
        ))}
      </div>
    )
  }
}
export default Tree;

Tree.propTypes = {
  onParentSelectHandlerFromFileExplorer: PropTypes.func.isRequired,
};

/*
================================
Helper Functions
================================
*/
// Builds a template node's object and pushes it to the 
// data map containing information about ever file or folder
// in the template.
function buildTemplateDataObject(template) {
  Object.keys(data).forEach(k => delete data[k])
  let templateCopy = JSON.parse(JSON.stringify( template ));
  for(let i = 0; i < templateCopy.structure.length; i++) {
    let structure = templateCopy.structure[i];
    let files = templateCopy.files;
    let absolutePath = templateCopy.structure[i].absolutePath
    let templateNode = {
      [absolutePath]: {
        path: absolutePath,
        type: structure.fileType,
        isRoot: i === 0 ? true : false,
        isOpen: true,
        children: structure.children,
        content: files.find(x => x.fileName === structure.name)
      }    
    }
    if(typeof templateNode[absolutePath].content === 'undefined') templateNode[absolutePath].content = '';
    data[absolutePath] = templateNode[absolutePath];
  }
}