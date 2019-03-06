import React from 'react'
import { Link } from 'react-router-dom';
import "../../styles/Project-Selection/ProjectSelection.css";
import Dropdown from './Dropdown';
import '../../styles/Project-Selection/Dropdown.css';

class ProjectSelection extends React.Component {
    render() {
        return (
            <div className="project-body">
                <div className="project-button-container"> 
                    <Link className="new-project-link" to="/PluginApp">New Project</Link>
                </div>
                <div className="project-dropdown-container">
                    <div><Dropdown className="new-project-link"/></div>
                </div>
            </div>
        );
    }
}
export default ProjectSelection;