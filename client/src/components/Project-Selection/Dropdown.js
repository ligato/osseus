import React from 'react';
import '../../styles/Project-Selection/Dropdown.css';


class Dropdown extends React.Component {
constructor(){
 super();

 this.state = {
       displayMenu: false,
     };

  this.showDropdownMenu = this.showDropdownMenu.bind(this);
  this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

};

showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }

  tellMe() {
    console.log("project 1");
  }

  render() {
    return (
        <div  className="dropdown" style = {{background:"red",width:"200px"}} >
	        <div className="button" onClick={this.showDropdownMenu}> Saved Projects </div>

          { this.state.displayMenu ? (
          <ul>
    		   <li><a href="#Create Page" onClick={this.tellMe}>Project 1</a></li>
    		   <li><a href="#Manage Pages">Project 2</a></li>
    		   <li><a href="#Create Ads">Project 3</a></li>
          </ul>
        ):
        (
          null
        )
        }

	      </div>

    );
  }


}


export default Dropdown;
