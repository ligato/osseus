import React from 'react';
import Swal from 'sweetalert2'

import store from '../../../redux/store/index';
import { setCurrProject, deleteProject } from "../../../redux/actions/index";

import '../../../styles_CSS/Plugin/Header/Dropdown.css';

let flip = true;
let clicked = false;

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false,
    };
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.closeDropdownMenu = this.closeDropdownMenu.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
  };

  //Function determines which dropdown list element is clicked
  handleDropdownClick = (event) => {
    event.preventDefault();
    store.dispatch(setCurrProject(loadProjectState(event.currentTarget.dataset.id)));
    this.props.loadedProjectHandlerFromHeader(store.getState().projects[event.currentTarget.dataset.id].projectName);
    flip = false;
  }

  showDropdownMenu(event) {
    event.preventDefault();
    if (store.getState().projects.length === 0) {
      noCurrentSavesToast();
    }
    clicked = !clicked;
    flip = !flip;
    this.setState({ displayMenu: !flip });
  }

  closeDropdownMenu() {
    if (clicked) {
      flip = !flip;
      this.setState({ displayMenu: !flip });
      clicked = false
    }
  }

  deleteProject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    store.dispatch( deleteProject(store.getState().projects[event.currentTarget.dataset.id].projectName) )
    store.getState().projects.splice(event.currentTarget.dataset.id,1);
    this.forceUpdate()
    flip = false;
    
  }

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  render() {
    return (
      <div className="dropdown" onClick={this.showDropdownMenu} onMouseLeave={this.closeDropdownMenu}>
        <div className="dropdown-button" > Saved Projects </div>
        {this.state.displayMenu ? (
          <ul>
            {store.getState().projects.map((plugin, index) => {
              return (
                <li
                  data-id={index}
                  onClick={this.handleDropdownClick}
                  key={index}
                >
                  <div className="list-text">{store.getState().projects[index].projectName}</div>
                  <div className="delete-img-container" 
                    onClick={this.deleteProject}
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

//Function loads a project based on the specific clicked dropdown item
function loadProjectState(projectID) {
  let project = JSON.parse(JSON.stringify(store.getState().projects[projectID]));
  return project;
}

//Funtion tells the user that there doesnt exist a saved project 
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


