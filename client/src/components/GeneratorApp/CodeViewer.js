// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import PropTypes from 'prop-types';
import 'chai/register-expect';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

/***************************************************************
* This component displays the sent in code from the generator
* 
* GeneratorApp.js --> CodeViewer.js
****************************************************************/

const CodeViewer = (props) => {
  let codeString = props.sentInGeneratedCode
  return (
    <div className="body">
      <div className="split right-viewer">
        <div className="gencode">
          {/* Renders the generated code using the react syntax highlighter library */}
          <SyntaxHighlighter language="go" style={coy}>{codeString}</SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
export default CodeViewer;

CodeViewer.propTypes = {
  sentInGeneratedCode:  PropTypes.string.isRequired,
}
