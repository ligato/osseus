    
import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

let i = 0;

const data = {
  '/project': {
    path: '/project',
    type: 'folder',
    isRoot: true,
    isOpen: true,
    children: ['/project/cmd', '/project/plugins'],
  },
  '/project/cmd': {
    path: '/project/cmd',
    type: 'folder',
    isOpen: true,
    children: ['/project/cmd/agent'],
  },
  '/project/cmd/agent': {
    path: '/project/cmd/agent',
    type: 'folder',
    isOpen: true,
    children: ['/project/cmd/agent/main.go'],
  },
  '/project/cmd/agent/main.go': {
    path: '/project/cmd/agent/main.go',
    type: 'file',
    isOpen: true,
    content: 'main.go'
  },
  '/project/plugins': {
    path: '/project/plugins',
    type: 'folder',
    isOpen: true,
    children: ['/project/plugins/REDIS'],
  },
  '/project/plugins/REDIS': {
    path: '/project/plugins/REDIS',
    type: 'folder',
    isOpen: true,
    children: ['/project/plugins/REDIS/doc.go', '/project/plugins/REDIS/options.go', '/project/plugins/REDIS/plugin_impl_test.go'],
  },
  '/project/plugins/REDIS/doc.go': {
    path: '/project/plugins/REDIS/doc.go',
    type: 'file',
    isOpen: true,
    content: 'doc.go'
  },
  '/project/plugins/REDIS/options.go': {
    path: '/project/plugins/REDIS/options.go',
    type: 'file',
    isOpen: true,
    content: 'options.go'
  },
  '/project/plugins/REDIS/plugin_impl_test.go': {
    path: '/project/plugins/REDIS/plugin_impl_test.go',
    type: 'file',
    isOpen: true,
    content: 'plugin_impl_test.go'
  },
};

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
