import React from 'react';
import Swal from 'sweetalert2'

import store from '../../../redux/store/index';
import { setCurrProject } from "../../../redux/actions/index";

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

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  render() {
    return (
      <div className="dropdown" onClick={this.showDropdownMenu} onMouseLeave={this.closeDropdownMenu}>
        <div className="dropdown-button" > Saved Projects </div>
        {this.state.displayMenu ? (
          <ul >
            {store.getState().projects.map((plugin, index) => {
              return (
                <li
                  data-id={index}
                  onClick={this.handleDropdownClick}
                  key={index}
                >
                  {store.getState().projects[index].projectName}
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
  console.log('hello')
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


