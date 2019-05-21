import React from 'react';
import Swal from 'sweetalert2'

import store from '../../redux/store/index';
import { setCurrProject, deleteProject } from "../../redux/actions/index";

import '../../styles_CSS/Plugin/CustomPluginDropdown.css';

let flip = true;
let clicked = false;
let pluginModule = require('../Model');

let customPlugin = {
  CustomPluginName: 'untitled',
  PackageName: 'untitled',
  selected: false,
  id: 11,
}

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
    pluginModule.customPlugin.customPluginName = 'hello'
    this.props.loadedProjectHandlerFromHeader(store.getState().projects[event.currentTarget.dataset.id].projectName);
    flip = false;
  }

  addNewCustomPlugin() {
    (async () => {
      let customPluginData = await getName();
      if(!customPluginData) return;
      saveCustomPlugin(customPluginData);
    })()
  }

  showDropdownMenu(event) {
    event.preventDefault();
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
    pluginModule.project.customPlugins.splice(event.currentTarget.dataset.id, 1);
    this.forceUpdate()
    flip = false;
    
  }

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  render() {
    return (
      <div className="plugin-dropdown" onClick={this.showDropdownMenu} onMouseLeave={this.closeDropdownMenu}>
        <div className="plugin-dropdown-button">Custom Plugins</div>
        {this.state.displayMenu ? (
          <ul className="plugin-ul">
            <li
              onClick={this.addNewCustomPlugin}
            >
              <div className="new-plugin-text">Custom Plugin
                <img
                  src={'/images/add.png'}
                  alt='close'
                  className="add-img"></img>
              </div>
            </li>
            {pluginModule.project.customPlugins.map((plugin, index) => {
              return (
                <li
                  data-id={index}
                  onClick={this.handleDropdownClick}
                  key={index}
                >
                  <div className="list-text">{pluginModule.project.customPlugins[index].customPluginName}</div>
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

async function getName () {
  const {value: formValues} = await Swal.fire({
    title: 'Custom Plugin',
    html:
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Name:</p><input style="float:right; width: 300px" id="swal-input1"></div>' +
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Package:</p><input style="float:right; width: 300px" id="swal-input2"></div>',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  })
  return formValues;
}

function saveCustomPlugin(data) {
  let customPluginCopy = JSON.parse(JSON.stringify( customPlugin ));
  customPluginCopy.customPluginName = data[0];
  customPluginCopy.package = data[1];
  pluginModule.project.customPlugins.push(customPluginCopy);
}



