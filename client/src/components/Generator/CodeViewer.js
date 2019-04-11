
import React from 'react';
import 'chai/register-expect';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

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
