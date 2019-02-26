import React from 'react';
import CodeStructure from './CodeStructure';
import CodeViewer from './CodeViewer';
import "../../styles/Generator/GeneratorApp.css";

class GeneratorApp extends React.Component {
  render () {
    return (
       <div>
            <CodeStructure />
            <CodeViewer />
       </div>
    )
  }
}
export default GeneratorApp;