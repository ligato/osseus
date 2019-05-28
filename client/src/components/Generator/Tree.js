    
import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

let pluginModule = require('../Model');
let i = 0

let data = {};

for(let i = 0; i < pluginModule.structure.length; i++) {
  let template = pluginModule.structure[i].absolutePath;
  let templateNode = {
    [template]: {
      path: pluginModule.structure[i].absolutePath,
      type: pluginModule.structure[i].fileType,
      isRoot: i === 0 ? true : false,
      isOpen: true,
      children: pluginModule.structure[i].children,
      content: pluginModule.files.find(x => x.fileName === pluginModule.structure[i].name)
    }    
  }
  //templateNode.template.content = pluginModule.files.find(x => x.fileName === pluginModule.structure[i].name);
  if(typeof templateNode[template].content === 'undefined') templateNode[template].content = '';
  data[template] = templateNode[template];
}

console.log(data)

class Tree extends Component {

  state = {
    nodes: data,
  };

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
