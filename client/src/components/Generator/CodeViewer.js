import React from 'react';
import "../../styles/App.css";
import "../../styles/Generator/GeneratorApp.css";

/*
* This component represents the right webpage division. This will
* contain the generated code.
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