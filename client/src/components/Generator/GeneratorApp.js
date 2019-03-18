import React from 'react';
import CodeStructure from './CodeStructure';
import CodeViewer from './CodeViewer';
import "../../styles_CSS/Generator/GeneratorApp.css";


//This describes the format of the GeneratorApp
class GeneratorApp extends React.Component {
  render() {
    return (
      <div>
        <CodeStructure />
        <CodeViewer />
      </div>
    )
  }
}
export default GeneratorApp;