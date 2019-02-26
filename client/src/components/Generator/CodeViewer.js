import React from 'react';
import "../../styles/App.css";
import "../../styles/Generator/GeneratorApp.css";

/*This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const CodeViewer = (props) => {
    return (
        <div className="body">
            <div className="split right">
                <p className="whitetextgen">Code Viewer</p>
            </div>
        </div>
    );
};

export default CodeViewer;