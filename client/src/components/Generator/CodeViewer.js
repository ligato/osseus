
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

const CodeViewer = (props) => {
  let codeString = props.generatedCode
  return (
    <div className="body">
      <div className="split right-viewer">
        <div className="gencode">
          <SyntaxHighlighter language="go" style={coy}>{codeString}</SyntaxHighlighter>

        </div>
      </div>
    </div>
  );
};
export default CodeViewer;

//CodeViewer.propTypes = {}

