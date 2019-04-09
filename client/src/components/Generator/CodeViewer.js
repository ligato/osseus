
import React from 'react';
import 'chai/register-expect';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

<<<<<<< HEAD
// let pluginModule = require('../Model');
=======
>>>>>>> 1389f8038edb4b07a3c8a80442fd5e2ebe10a237
/*
* This component represents the right webpage division. This will
* contain the generated code.
*/


class CodeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null
    };
<<<<<<< HEAD
    console.log("codeviewer")
=======
>>>>>>> 1389f8038edb4b07a3c8a80442fd5e2ebe10a237
  }

  render() {
    return (
      <div className="body">
        <div className="split right-viewer">
          <p className="whitetextgen">Hello World</p>
        </div>
      </div>
    );
  }
}
export default CodeViewer;

//CodeViewer.propTypes = {}
