import React from 'react';
import store from '../../../redux/store/index';
import { setCurrProject } from "../../../redux/actions/index";
import Swal from 'sweetalert2'
import '../../../styles_CSS/Plugin/Header/Dropdown.css';

let flip = true;
let clicked= false;
//let pluginModule = require('../../Model');


class Dropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayMenu: false,
    };
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.closeDropdownMenu = this.closeDropdownMenu.bind(this);
  };

  handleClick = (e) => {
    e.preventDefault();
    console.log(e.currentTarget.dataset.id)
    store.dispatch( setCurrProject(this.loadProjectState(e.currentTarget.dataset.id)));
    console.log(store.getState().currProject)
    this.props.loadedProjectHandlerFromHeader();
    flip = false;
  }
  
  loadProjectState(projectID) {
    let project = store.getState().projects[projectID];
    return project;
  }
  

  showDropdownMenu(event) {
    clicked = !clicked;
    if(store.getState().projects.length === 0) {
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
    flip = !flip;
    event.preventDefault();
    this.setState({ displayMenu: !flip });
  }

  closeDropdownMenu() {
    if(clicked) {
      flip = !flip;
      this.setState({ displayMenu: !flip });
      clicked = false
    }
  }

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  //  
  render() {
    return (
      <div  className="dropdown" onClick={this.showDropdownMenu} onMouseLeave={this.closeDropdownMenu}>
	      <div className="dropdown-button" > Saved Projects </div>
          { this.state.displayMenu ? (
            <ul >
              {store.getState().projects.map((plugin, index) => {
                return (
                  <li
                    data-id={index} 
                    onClick={this.handleClick} 
                    key={index}
                  >
                  {store.getState().projects[index].projectName}
                  </li>
                )
              })}
            </ul>
            ) : ( null )
          }
      </div>
    );
  }
}
export default Dropdown;

  /*for(let i = 0; i < store.getState().projects[projectID].length; i++) {
    array[i] = store.getState().projects[projectID][i].selected*1;
    pluginModule.plugins[i].port = store.getState().projects[projectID][i].port;
  }*/


