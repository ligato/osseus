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
import { FaFile, FaFolder, FaFolderOpen, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import last from 'lodash/last';
import PropTypes from 'prop-types';

import "../../../styles_CSS/Generator/GeneratorApp.css";

//TreeNode.js Globals
let i = 0;

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 20px;
  cursor: pointer;
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;
  &:hover {
    background: lightgray;
  }
`;

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => props.marginRight ? props.marginRight : 5}px;
  color: #e8bb4d;
`;

const getNodeLabel = (node) => last(node.path.split('/'));

/**************************************************************************************
* This component defines a single node's logic within the tree structure.
* 
* GeneratorApp.js --> CodeStructure.js --> FileExplorer.js --> Tree.js --> TreeNode.js
**************************************************************************************/

const TreeNode = (props) => {
  const { node, getChildNodes, level, onToggleHandlerFromParent } = props;

  /*
  ================================
  Render
  ================================
  */
  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type} onClick={() => onToggleHandlerFromParent(node)}>
        {/* Render a chevron based on whether a file is open or closed. */}
        <NodeIcon >
          { node.type === 'folder' && (node.isOpen ? <FaChevronDown /> : <FaChevronRight />) }    
        </NodeIcon>
        {/* Inserts left padding based on tree level. */}
        <NodeIcon marginRight={10}>
          { node.type === 'file' && <FaFile /> }
          { node.type === 'folder' && node.isOpen === true && <FaFolderOpen /> }
          { node.type === 'folder' && !node.isOpen && <FaFolder /> }
        </NodeIcon>
        {/* Render the file/folder name. */}
        <span className="node-name">
          { getNodeLabel(node) }
        </span>
      </StyledTreeNode>

      {/* Displays the tree if a file node is marked as open. */}
      { node.isOpen && getChildNodes(node).map(childNode => (
        <TreeNode 
          {...props}
          node={childNode}
          key={i++}          
          level={level + 1}
        />
      ))}
    </React.Fragment>
  );
}
export default TreeNode;

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggleHandlerFromParent: PropTypes.func.isRequired,
};

TreeNode.defaultProps = {
  level: 0,
};

/*
================================
Helper Functions
================================
*/
//Inserts padding based on the tree level
const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20;
  if (type === 'file') paddingLeft += 20;
  return paddingLeft;
}
