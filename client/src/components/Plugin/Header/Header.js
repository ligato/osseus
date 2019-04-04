import React from 'react';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import store from '../../../redux/store/index';
import { addCurrProject } from "../../../redux/actions/index";
import Swal from 'sweetalert2'

import 'chai/register-expect';
import '../../../styles_CSS/Plugin/Header/Header.css';


let pluginModule = require('../../Model');

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
  }
  tellMeToSave () {
    var duplicate = false;
    var duplicatedObject = JSON.parse(JSON.stringify( store.getState().currProject ));
    let projectsState = store.getState().projects;
    for(let i = 0; i < projectsState.length; i++) {
      if(duplicatedObject.projectName === projectsState[i].projectName) duplicate = true;
    }
    if(!duplicate) {
      store.dispatch( addCurrProject([duplicatedObject]));
      
      const savedToast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
      savedToast.fire({
        type: 'success',
        title: pluginModule.project.projectName + ' saved successfully',
      })
    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Another project under this name already exists!',
      })
      console.log("nah")
    }
  }

  resetPalette = () => {
    this.props.newProjectHandlerFromParent();
  }

  bubbleUpLoadedProjectToParent = () => {
    this.props.loadedProjectHandlerFromParent();
  }

  render() {
    return (
      <div>
        <Segment>
          <Grid columns={1} relaxed='very'>
            <Grid.Column className="header-column"  >
              <button className="new-project-button" onClick={this.resetPalette}>New Project</button>
              <Dropdown 
                className="new-project-link"
                loadedProjectHandlerFromHeader={this.bubbleUpLoadedProjectToParent}
              />
              <p className="current-project">Current Project: 
                <span 
                  className="project-name" 
                  suppressContentEditableWarning="true" 
                  spellCheck="false"
                  contentEditable="true"
                  >
                    {" " + this.props.currentProjectName}
                </span>
              </p>
              <Link className="generator-link" to="/GeneratorApp">Generate</Link>
              <button className="save-button" onClick={this.tellMeToSave} >Save Project</button>
            </Grid.Column>
          </Grid>
          <Divider vertical></Divider>
        </Segment>
      </div>
    );
  }
}
export default Header;
