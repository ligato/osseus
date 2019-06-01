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
      currentProjectName: store.getState().currProject.projectName,
      selectedFile: 'main.go',
      loading: false,
      downloadable: true,
      template: null,
      tempTemplate: null,
    };
    this.newProjectName = this.newProjectName.bind(this);
    this.onSelectParent = this.onSelectParent.bind(this);
  }

  async componentDidMount() {
    // Setting the loader on
    this.setState({ loading: true });

    // Get the template from the model
    let template = store.subscribe(() => {
      this.state.tempTemplate = store.getState().template
    })
    console.log(this.state.tempTemplate)
    if (this.state.tempTemplate !== null) {
      this.setState({
        loading: false,
        template: this.state.tempTemplate,
      });
    }
    template()
    // return Promise.resolve();
  }

  // Function saves the retrieved new name from the children
  // of generator app
  newProjectName(projectName) {
    this.setState({
      currentProjectName: projectName
    });
  }

  onSelectParent = (file) => {
    if (file.type === 'file') {
      this.setState({ selectedFile: file.content.content })
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Header
            newProjectNameHandler={this.newProjectName}
            currentProjectName={this.state.currentProjectName}
            downloadable={this.state.downloadable}
          />
          <div className="loader-div">
            <div className="loader" />
          </div>
        </div>
      )
    }
    return (
      <div>
        <Header
          newProjectNameHandler={this.newProjectName}
          currentProjectName={this.state.currentProjectName}
          downloadable={this.state.downloadable}
        />
        <CodeStructure
          onSelect_3={this.onSelectParent}
          template1={this.state.template}
          loading={this.state.loading}
        />
        <CodeViewer
          generatedCode={this.state.selectedFile}
        />
      </div>
    )
  }
}

export default (GeneratorApp);
//export default connect(mapStateToProps)(GeneratorApp);

function getTemplate() {
  return pluginModule.template;
}

