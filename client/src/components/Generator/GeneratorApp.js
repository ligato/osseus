import React from 'react';
import CodeStructure from './CodeStructure';
import CodeViewer from './CodeViewer';
import Header from './Header/Header';
import store from '../../redux/store/index';
import "../../styles_CSS/Generator/GeneratorApp.css";

let pluginModule = require('../Model');

//This describes the format of the GeneratorApp
class GeneratorApp extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProjectName: store.getState().currProject.projectName
    };
    this.newProjectName = this.newProjectName.bind(this);
  }
  newProjectName(name) {
    this.setState({
      currentProjectName: name
    });
  }

  render() {
    return (
      <div>
        <Header
          newProjectNameHandler={this.newProjectName}
          currentProjectName={this.state.currentProjectName}
        />
        <CodeStructure/>
        <CodeViewer generatedCode={pluginModule.generatedCode} />
      </div>
    )
  }
}
export default GeneratorApp;
