import React from 'react';
import 'chai/register-expect';
import Swal from 'sweetalert2'
import ContentEditable from 'react-contenteditable'
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import store from '../../../redux/store/index';
import { addCurrProject, saveProjectToKV, loadProjectFromKV } from "../../../redux/actions/index";

import '../../../styles_CSS/Generator/Header/Header.css';

let pluginModule = require('../../Model');

/*
* This header has a link to the plugin app page and two buttons
* for download the tar file and annother for saving the project 
* within the generator page.
*/

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedName: ' '
    };
    this.handleEditedProjectName = this.handleEditedProjectName.bind(this);
    this.downloadTar = this.downloadTar.bind(this);
    this.saveProject= this.saveProject.bind(this);
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
    this.props.newProjectNameHandler(projectCopyName);
    store.dispatch( saveProjectToKV(store.getState().currProject) );
  }

  tellMeToLoad() {
    store.dispatch( loadProjectFromKV(store.getState().currProject.projectName) );
  }

  downloadTar() {
    console.log('download')
  }

  //Function will communicate if user edited the project name
  handleEditedProjectName = evt => {
    let editedProjectName = evt.target.value;
    store.getState().currProject.projectName = editedProjectName;
    pluginModule.project.projectName = editedProjectName;
    this.props.newProjectNameHandler(editedProjectName)
  };

  render() {
    return (
      <Segment>
        <Grid columns={1} relaxed='very'>
          <Grid.Column className="header-column"  >
            <Link className="plugin-app-button" to="/">Plugin App</Link>
            <div className="header-text">
              <p className="current-project">Current Project: </p>
              <ContentEditable
                  spellCheck={false}
                  className="project-name"
                  html={this.props.currentProjectName} // innerHTML of the editable div
                  disabled={false} // use true to disable edition
                  onChange={this.handleEditedProjectName} // handle innerHTML change
              />
            </div>
            <button className="download-button" onClick={this.downloadTar} >Download</button>
            <button className="save-button-generator" onClick={this.saveProject} >Save Project</button>
            <button className="load-button-generator" onClick={this.tellMeToLoad} >Load Project</button>
          </Grid.Column>
        </Grid>
        <Divider vertical></Divider>
      </Segment>
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

