import React from 'react';
import CodeStructure from './CodeStructure';
import CodeViewer from './CodeViewer';
import Header from './Header/Header';
import store from '../../redux/store/index';
import "../../styles_CSS/Generator/GeneratorApp.css";

//This describes the format of the GeneratorApp
class GeneratorApp extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProjectName: store.getState().currProject.projectName,
      selectedFile: 'main.go',
    };
    this.newProjectName = this.newProjectName.bind(this);
    this.onSelectParent = this.onSelectParent.bind(this);
  }

  //Function saves the retrieved new name from the children
  //of generator app
  newProjectName(projectName) {
    this.setState({
      currentProjectName: projectName
    });
  }

  onSelectParent = (file) => { 
    if(file.type === 'file') {
      this.setState({ selectedFile: file.content })
    }
  }

  render() {
    return (
      <div>
        <Header
          newProjectNameHandler={this.newProjectName}
          currentProjectName={this.state.currentProjectName}
        />
        <CodeStructure onSelect_3={this.onSelectParent}/>
        <CodeViewer generatedCode={this.state.selectedFile} />
      </div>
    )
  }
}
export default GeneratorApp;
