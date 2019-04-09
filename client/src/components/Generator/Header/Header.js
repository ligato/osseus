import React from 'react';
import 'chai/register-expect';
import '../../../styles_CSS/Generator/Header/Header.css';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import store from '../../../redux/store/index';
import Swal from 'sweetalert2'
import { addCurrProject } from "../../../redux/actions/index";
import ContentEditable from 'react-contenteditable'

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
    this.state = {
      displayedName: ' '
    };
    this.handleChange = this.handleChange.bind(this);
    this.tellMeToDownload = this.tellMeToDownload.bind(this);
    this.tellMeToSave = this.tellMeToSave.bind(this);
  }

  tellMeToSave () {
    var objectCopy = JSON.parse(JSON.stringify( store.getState().currProject ));
    var duplicate = determineIfDuplicate(objectCopy.projectName);   
    if(!duplicate) {
      store.dispatch( addCurrProject([objectCopy]));
      
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
      store.dispatch( addCurrProject([objectCopy]));
      let latestProjectName = store.getState().projects[store.getState().projects.length-1].projectName;
      while(determineIfDuplicate(latestProjectName)) {
        latestProjectName = makeUniqueAgain(latestProjectName);
        console.log(determineIfDuplicate(latestProjectName))
      }
      let rename = latestProjectName
    
      store.getState().projects[store.getState().projects.length-1].projectName = rename;
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

  handleChange = evt => {
    nameCapture = evt.target.value;
    this.props.newProjectNameHandler(nameCapture)
    store.getState().currProject.projectName = nameCapture;
    pluginModule.project.projectName = nameCapture;
  };

  tellMeToDownload() {
    console.log('download')
  }

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
                  onChange={this.handleChange} // handle innerHTML change
              />
            </div>
            <button className="download-button" onClick={this.tellMeToDownload} >Download</button>
            <button className="save-button-generator" onClick={this.tellMeToSave} >Save Project</button>
          </Grid.Column>
        </Grid>
        <Divider vertical></Divider>
      </Segment>
    );
  }
}
export default Header;

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

function makeUniqueAgain(projectName) {
  let regex = /\([0-9]+\)/;
  if(projectName.match(regex)) {
    let regexNumber = /[0-9]+/
    let nthDuplicate = Number(projectName.match(regexNumber)[0]);
    let matchSize = projectName.match(regex)[0].length
    projectName = projectName.slice(0,-matchSize)
    projectName = projectName + '(' + (nthDuplicate+1) + ')'
    console.log(typeof(projectName))
  } else {
    projectName = projectName + '(1)';
  }
  return projectName;
}
