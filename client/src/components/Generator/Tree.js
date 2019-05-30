    
import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

let pluginModule = require('../Model');
let i = 0

let data = {};

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: data,
    };
    if((this.props.template3 !== null && this.props.template3 !== ' ')) buildTemplateDataObject(this.props.template3);
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

  onToggle = (node) => {
    if(node.type === 'folder') {
      const { nodes } = this.state;
      nodes[node.path].isOpen = !node.isOpen;
      this.setState({ nodes });
    } else {
      let sendNode = JSON.parse(JSON.stringify(node));
      this.props.onSelect(sendNode);
    }
  }

  onNodeSelect = node => {
    let sendNode = JSON.parse(JSON.stringify(node));
    this.props.onSelect(sendNode);
  }

  render() {
    const rootNodes = this.getRootNodes();
    return (
      <div>
        { rootNodes.map(node => (
          <TreeNode 
            node={node}
            getChildNodes={this.getChildNodes}
            onToggle={this.onToggle}
            onNodeSelect={this.onNodeSelect}
            key={i++}
          />
        ))}
      </div>
    )
  }
}
export default Tree;

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

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
  console.log(data)
}
