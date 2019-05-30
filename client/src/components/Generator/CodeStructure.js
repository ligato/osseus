import React from 'react';
//import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";
import FileExplorer from './FileExplorer';

/*
* This component represents the left webpage division. This will
* contain the file structure of the generated code.
*/
 
class CodeStructure extends React.Component {
  constructor(props) {
    super(props);
  }
  onSelect_2 = (file) => { 
    this.props.onSelect_3(file);
  };
  render() {
    return (
      <div className="body">
        <div className="split left">
          <div className="filestructure"> 
            <FileExplorer 
              onSelect_1={this.onSelect_2} 
              template2={this.props.template1}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default CodeStructure;

//CodeStructure.propTypes = {}