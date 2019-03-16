import React from 'react';
import { Link } from 'react-router-dom';
import store from '../../redux/store/index';
import { setCurrArray } from "../../redux/actions/index";
import '../../styles_CSS/Project-Selection/Dropdown.css';

let flip = true;

function handleClick (e) {
  store.dispatch( setCurrArray(store.getState().projects[e.currentTarget.dataset.id]));
  flip = false;
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
