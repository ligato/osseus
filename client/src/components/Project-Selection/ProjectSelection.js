import React from 'react'
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import "../../styles_CSS/Project-Selection/ProjectSelection.css";
import '../../styles_CSS/Project-Selection/Dropdown.css';

/*
* This defines the format of the project selection page. It
* consists of a button for a new project and a dropdown displaying
* all the projects that were saved by the user.
*/
class ProjectSelection extends React.Component {
  render() {
    return (
      <div className="project-body">
        <div className="project-button-container"> 
          <Link className="new-project-link" to="/PluginApp">New Project</Link>
        </div>
        <div className="project-dropdown-container">
          <Dropdown className="new-project-link"/>
        </div>
      </div>
    );
  }
}
export default ProjectSelection;