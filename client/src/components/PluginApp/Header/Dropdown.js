// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import '../../../styles_CSS/Plugin/Header/Dropdown.css';

import store from '../../../redux/store/index';
import { setCurrProject, deleteProject } from "../../../redux/actions/index";

// Dropdown globals
let flip = true;
let clicked = false;

/***************************************************************
* This component defines the dropdown for the PluginAppHeader
* 
* PluginApp.js --> PluginAppHeader.js --> Dropdown.js      
****************************************************************/

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false,
    };
    this.openDropdownMenuHandler = this.openDropdownMenuHandler.bind(this);
    this.closeDropdownMenuHandler = this.closeDropdownMenuHandler.bind(this);
    this.dropdownClickHandler = this.dropdownClickHandler.bind(this);
    this.deleteProjectHandler = this.deleteProjectHandler.bind(this);
  };

   /*
  ================================
  Handler Functions
  ================================
  */
  dropdownClickHandler = (event) => {
    event.preventDefault();
    store.dispatch(setCurrProject(loadProjectState(event.currentTarget.dataset.id)));
    this.props.loadedProjectHandlerFromParent(store.getState().projects[event.currentTarget.dataset.id].projectName);
    flip = false;
  }

  openDropdownMenuHandler(event) {
    event.preventDefault();
    if (store.getState().projects.length === 0) {
      noCurrentSavesToast();
    }
    clicked = !clicked;
    flip = !flip;
    this.setState({ displayMenu: !flip });
  }

  closeDropdownMenuHandler() {
    if (clicked) {
      flip = !flip;
      this.setState({ displayMenu: !flip });
      clicked = false
    }
  }

  deleteProjectHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    store.dispatch( deleteProject(store.getState().projects[event.currentTarget.dataset.id].projectName) )
    store.getState().projects.splice(event.currentTarget.dataset.id,1);
    this.forceUpdate()
    flip = false;
    
  }

  /*
  ================================
  Render
  ================================
  */
  render() {
    return (
      <div className="dropdown" onClick={this.openDropdownMenuHandler} onMouseLeave={this.closeDropdownMenuHandler}>
        <div className="dropdown-button" > Saved Projects </div>
        {/* If displayMenu is true render the dropdown list */}
        {this.state.displayMenu ? (
          <ul>
            {/* Maps over the saves projects rendering each by name */}
            {store.getState().projects.map((plugin, index) => {
              return (
                <li
                  data-id={index}
                  onClick={this.dropdownClickHandler}
                  key={index}
                >
                  <div className="list-text">{store.getState().projects[index].projectName}</div>
                  {/* For each list item name, also render an 'x' for deleting*/}
                  <div className="delete-img-container" 
                    onClick={this.deleteProjectHandler}
                    data-id={index}>
                    <img
                      src={'/images/close.png'}
                      alt='close'
                      className="delete-img"></img>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (null)
        }
      </div>
    );
  }
}
export default Dropdown;

Dropdown.propTypes = {
  loadedProjectHandlerFromParent:      PropTypes.func.isRequired,    
}

/*
================================
Helper Functions
================================
*/
// Loads a project based on the specific clicked dropdown item
function loadProjectState(projectID) {
  let project = JSON.parse(JSON.stringify(store.getState().projects[projectID]));
  return project;
}

// Tells the user that there doesnt exist a saved project 
function noCurrentSavesToast() {
  const noProjectsToast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 1500,
  })
  noProjectsToast.fire({
    type: 'error',
    title: 'No saved Projects',
  })
}


