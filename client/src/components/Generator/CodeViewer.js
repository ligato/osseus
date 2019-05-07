
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'chai/register-expect';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

/*
* This component represents the right webpage division. This will
* contain the generated code.
*/

function FileHelper(path) {
  let pathOfFileToReadFrom = path
  FileHelper.readStringFromFileAtPath = pathOfFileToReadFrom
  let request = new XMLHttpRequest();
  request.open("GET", pathOfFileToReadFrom, false);
  request.send(null);
  let returnValue = request.responseText;
  return returnValue;
}



const codeString = FileHelper("code.txt");

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
          <SyntaxHighlighter className="gencode" language="go" style={coy}>{codeString}</SyntaxHighlighter>
        </div>
      </div>
    );
  }
}
export default CodeViewer;

//CodeViewer.propTypes = {}

