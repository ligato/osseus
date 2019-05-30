import React, { Component } from 'react';
import styled from 'styled-components';
import Tree from './Tree';
import "../../styles_CSS/Generator/GeneratorApp.css";

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

class FileExplorer extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      currentFile: 'main.go',
      template: ''
    };

  }
  onSelect = (file) => { 
    this.setState({
      currentFile: file.content.fileName
    });
    this.props.onSelect_1(file);
  };

  /*componentWillReceiveProps({template}) {
    this.setState({...this.state, template})
    console.log(template)
  }*/

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
              onSelect={this.onSelect} 
              template3={this.props.template2}
              loading={this.props.loading}
            />
          </TreeWrapper>
        </StyledFileExplorer>

      </div>
    )
  }
}
export default FileExplorer
