import React from 'react';
import { Link } from 'react-router-dom';
import store from '../../redux/store/index';
import { setCurrArray } from "../../redux/actions/index";
import swal from 'sweetalert';
import '../../styles_CSS/Project-Selection/Dropdown.css';

let flip = true;
let pluginModule = require('../Plugins');

function handleClick (e) {
  console.log([store.getState().projects])
  store.dispatch( setCurrArray(loadPluginState(e.currentTarget.dataset.id)));
  flip = false;
}

function loadPluginState(projectID) {
  let array = [];
  for(let i = 0; i < store.getState().projects[projectID].length; i++) {
    array[i] = store.getState().projects[projectID][i].selected*1;
    pluginModule.plugins[i].port = store.getState().projects[projectID][i].port;
  }
  return array;
}

class Dropdown extends React.Component {
  constructor(){
    super();
    this.state = {
      displayMenu: false,
    };
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
  };

  showDropdownMenu(event) {
    if(store.getState().projects.length === 0) {
      swal("No saved projects.")
    }
    flip = !flip;
    event.preventDefault();
    this.setState({ displayMenu: !flip });
  }

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  //  
  render() {
    return (
      <div  className="dropdown" onClick={this.showDropdownMenu} style = {{background:"#4AC68E",width:"172.38px"}} >
	      <div className="button" > Saved Projects </div>
          { this.state.displayMenu ? (
            <ul>
              {store.getState().projects.map((plugin, index) => {
                return (
                  <li
                    data-id={index} 
                    onClick={handleClick} 
                    key={index}
                  >
                    <Link to="/PluginApp">Project {index+1}</Link>
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


