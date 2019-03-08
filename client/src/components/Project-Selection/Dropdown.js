import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles_CSS/Project-Selection/Dropdown.css';

let flip = true;

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

  setFlip() { flip = true; }

  //The logic of how this dropdown works is that the list is
  //shown and hidden based on the click of the dropdown button.
  //  
  render() {
    return (
      <div  className="dropdown" onLoad={this.setFlip} style = {{background:"red",width:"200px"}} >
	      <div className="button" onClick={this.showDropdownMenu}> Saved Projects </div>
          { this.state.displayMenu ? (
            <ul>
    		      <li><Link to="/PluginApp">Project 1</Link></li>
    		      <li><Link to="/PluginApp">Project 2</Link></li>
    		      <li><Link to="/PluginApp">Project 3</Link></li>
            </ul>
            ) : ( null )
          }
      </div>
    );
  }
}
export default Dropdown;
