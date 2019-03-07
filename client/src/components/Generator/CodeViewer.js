import React from 'react';
//import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

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

//CodeViewer.propTypes = {}
