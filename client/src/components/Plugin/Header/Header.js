import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import store from '../../../redux/store/index';
import { addCurrProject, saveProject, loadProject, generateCurrProject } from "../../../redux/actions/index";
import Swal from 'sweetalert2'
import ContentEditable from 'react-contenteditable'
import 'chai/register-expect';
import '../../../styles_CSS/Plugin/Header/Header.css';


let pluginModule = require('../../Model');
let nameCapture;

/*
* This header contains two Links in the form of links that each represent a route 
* their own webpage. Project selection is the default (/) route.
* Because of how this header is rendered in App.js, this compenent is rendered on all
* pages for site navigation.
*/

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.tellMeToSave = this.tellMeToSave.bind(this);
    this.resetPalette = this.resetPalette.bind(this);
    this.bubbleUpLoadedProjectToParent = this.bubbleUpLoadedProjectToParent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      displayedName: ' '
    };
  }
  tellMeToLoad() {
    store.dispatch(loadProject(store.getState().currProject.projectName))
  }

  tellMeToSave() {
    var objectCopy = JSON.parse(JSON.stringify(store.getState().currProject));
    var duplicate = determineIfDuplicate(objectCopy.projectName);
    store.dispatch(saveProject(store.getState().currProject))
    console.log(store.getState().projects)
    // loadProject() 
    if (!duplicate) {
      store.dispatch(addCurrProject([objectCopy]));

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
    } else {
      store.dispatch(addCurrProject([objectCopy]));
      let latestProjectName = store.getState().projects[store.getState().projects.length - 1].projectName;
      while (determineIfDuplicate(latestProjectName)) {
        latestProjectName = makeUniqueAgain(latestProjectName);
        console.log(determineIfDuplicate(latestProjectName))
      }
      let rename = latestProjectName

      store.getState().projects[store.getState().projects.length - 1].projectName = rename;
      this.props.newProjectNameHandler(rename)
      store.getState().currProject.projectName = rename;
      pluginModule.project.projectName = rename;

      const savedToast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      })
      savedToast.fire({
        type: 'warning',
        title: 'Warning!',
        text: 'Another project under this name already exists! Your project will be renamed: "' + rename + '"',
      })
    }
  }

  tellMeToGenerate() {
    console.log("im here")
    store.dispatch(generateCurrProject(store.getState().currProject))
  }

  handleChange = evt => {
    nameCapture = evt.target.value;
    this.props.newProjectNameHandler(nameCapture)
    store.getState().currProject.projectName = nameCapture;
    pluginModule.project.projectName = nameCapture;
  };

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
            <Grid.Column className="header-column"  >
              <Dropdown
                className="new-project-link"
                loadedProjectHandlerFromHeader={this.bubbleUpLoadedProjectToParent}
              />
              <img
                className="new-project-image"
                src='/images/new-project.png'
                alt='oops'
                onClick={this.resetPalette}>
              </img>
              <div className="header-text">
                <p className="current-project">Current Project: </p>
                <ContentEditable
                  spellCheck={false}
                  className="project-name"
                  html={this.props.currentProjectName} // innerHTML of the editable div
                  disabled={false} // use true to disable edition
                  onChange={this.handleChange} // handle innerHTML change
                />
              </div>
              <Link className="generator-link" onClick={this.tellMeToGenerate} to="/GeneratorApp">Generate</Link>
              <button className="save-button" onClick={this.tellMeToSave} >Save Project</button>
              <button className="save-button" style={{ marginRight: '210px' }} onClick={this.tellMeToLoad} >Load Project</button>
            </Grid.Column>
          </Grid>
          <Divider vertical></Divider>
        </Segment>
      </div>
    );
  }
}
export default Header;

function determineIfDuplicate(projectName) {
  let isDuplicate;
  for (let i = 0; i < store.getState().projects.length; i++) {
    if (projectName === store.getState().projects[i].projectName) {
      isDuplicate = true;
      return isDuplicate;
    }
  }
  return isDuplicate = false;
}

function makeUniqueAgain(projectName) {
  let regex = /\([0-9]+\)/;
  if (projectName.match(regex)) {
    let regexNumber = /[0-9]+/
    let nthDuplicate = Number(projectName.match(regexNumber)[0]);
    let matchSize = projectName.match(regex)[0].length
    projectName = projectName.slice(0, -matchSize)
    projectName = projectName + '(' + (nthDuplicate + 1) + ')'
  } else {
    projectName = projectName + '(1)';
  }
  return projectName;
}
