import React from 'react';
import Dropdown from './Dropdown';
import 'chai/register-expect';
import Swal from 'sweetalert2'
import ContentEditable from 'react-contenteditable'
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'

import store from '../../../redux/store/index';
import { addCurrProject, saveProjectToKV, loadProjectFromKV, generateCurrProject } from "../../../redux/actions/index";
//, downloadTemplate, downloadGO

import '../../../styles_CSS/Plugin/Header/Header.css';

let pluginModule = require('../../Model');

/*
* This header has a dropdown menu showing all saved project, and 
* an add project icon button, save and load buttons and a generate
* button that links to the generator page.
*/

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedName: ' '
    };
    this.saveProject = this.saveProject.bind(this);
    this.loadProject = this.loadProject.bind(this);
    this.generateProject = this.generateProject.bind(this);
    this.resetPalette = this.resetPalette.bind(this);
    this.bubbleUpLoadedProjectToParent = this.bubbleUpLoadedProjectToParent.bind(this);
    this.handleEditedProjectName = this.handleEditedProjectName.bind(this);
  }

  saveProject() {
    const projectCopy = JSON.parse(JSON.stringify( store.getState().currProject ));
    let projectCopyName = projectCopy.projectName;
    let isDuplicateName = determineIfDuplicate(projectCopyName);  
    //Their project name was found to be unique
    if(!isDuplicateName) {
      store.dispatch( addCurrProject([projectCopy]));
      successfulSaveToast();
    //Their project name was found to already exist
    } else {
      store.dispatch( addCurrProject([projectCopy]));
      //Executes while project identifier number for project name is taken    
      while(determineIfDuplicate(projectCopyName)) {
        projectCopyName = makeUniqueAgain(projectCopyName);
      }
      syncProjectNameState(projectCopyName);
      successfulRenameToast();
    }
    //
    this.props.newProjectNameHandler(projectCopyName)
    store.dispatch( saveProjectToKV(store.getState().currProject) )
    console.log(store.getState().projects)
  }

  loadProject() {
    store.dispatch( loadProjectFromKV(store.getState().currProject.projectName) );
  }

  generateProject() {
    store.dispatch( generateCurrProject(store.getState().currProject) );
  }

  //Function communicates if user edited the project name
  handleEditedProjectName = evt => {
    let editedProjectName = evt.target.value;
    store.getState().currProject.projectName = editedProjectName;
    pluginModule.project.projectName = editedProjectName;
    this.props.newProjectNameHandler(editedProjectName)
  };

  //Function resets the palette stae if user clicked new project icon
  resetPalette = () => {
    this.props.newProjectHandlerFromParent();
  }

  bubbleUpLoadedProjectToParent = (name) => {
    this.props.loadedProjectHandlerFromParent(name);
  }

  render() {
    return (
      <div>
        <Segment>
          <Grid columns={1} relaxed='very'>
            <Grid.Column className="header-column-plugin"  >
              <div className="cisco-logo-div">
                <img
                  className="cisco-logo"
                  src='/images/cisco-logo.png'
                  alt='oops'
                  onClick={this.resetPalette}>
                </img>
              </div>
              <Dropdown
                className="new-project-link"
                loadedProjectHandlerFromHeader={this.bubbleUpLoadedProjectToParent}
              />
              <img
                className="new-project-image"
                src='/images/new-project.png'
                alt='oops'
                onClick={this.resetPalette}
                data-tip="New Project">
              </img>
              <div className="header-text">
                <p className="currentproject">Current Project: </p>
                <ContentEditable
                  spellCheck={false}
                  className="projectname"
                  html={this.props.currentProjectName} // innerHTML of the editable div
                  disabled={false} // use true to disable edition
                  onChange={this.handleEditedProjectName} // handle innerHTML change
                />
              </div>
              <Link className="generatorlink" onClick={this.generateProject} to="/GeneratorApp">Generate</Link>
              <div>
                <img
                  className="upload-image"
                  src='/images/upload.png'
                  alt='oops'
                  onClick={this.saveProject}
                  data-tip="Upload Project">
                </img>
              </div>
            </Grid.Column>
          </Grid>
          <Divider vertical></Divider>
        </Segment>
        <ReactTooltip
          place="bottom"
          effect="solid"
        />
      </div>
    );
  }
}
export default Header;

//Function will search through all existing project names
//to determine a match. Return true if a match is found.
function determineIfDuplicate(projectName) {
  let isDuplicate;
  for(let i = 0; i < store.getState().projects.length; i++) {
    if(projectName === store.getState().projects[i].projectName) {
      isDuplicate = true;
      return isDuplicate;
    } 
  }
  return isDuplicate = false;
}

//Function will make the duplicatedName unique again by adding 
//a unique identifier (#) to the end of the project name.
function makeUniqueAgain(projectName) {
  const regexIdentifier = /\([0-9]+\)/;
  const regexNumber = /[0-9]+/;
  if(projectName.match(regexIdentifier)) {
    let nthDuplicate = Number(projectName.match(regexNumber)[0]);
    let matchSize = projectName.match(regexIdentifier)[0].length;

    projectName = projectName.slice(0,-matchSize)
    projectName = projectName + '(' + (nthDuplicate+1) + ')'
  } else {
    projectName = projectName + '(1)';
  }
  return projectName;
}

//Function will take project name and update local and redux project
//name state.
function syncProjectNameState(projectName) {
  if(store.getState().projects[store.getState().projects.length-1]) {
    store.getState().projects[store.getState().projects.length-1].projectName = projectName;
  }
  store.getState().currProject.projectName = projectName;
  pluginModule.project.projectName = projectName;
}


//Function will present a toast indicating a successful save.
//This means their project name was found to be unique.
function successfulSaveToast() {
  const savedToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
  })
  savedToast.fire({
    type: 'success',
    title: '"' + pluginModule.project.projectName + '" saved successfully',
  })
}

//Function will present a toast indicating their project was renamed and saved
//This means their picked name was found to already exist.
function successfulRenameToast() {
  const savedToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
  })
  savedToast.fire({
    type: 'warning',
    title: 'Warning!',
    text: 'Another project under this name already exists! Your project will be renamed: "' 
          + pluginModule.project.projectName + '"',
  })
}
