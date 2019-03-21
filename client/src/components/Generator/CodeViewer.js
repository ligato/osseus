import React from 'react';
import 'chai/register-expect';
import "../../styles_CSS/App.css";
import "../../styles_CSS/Generator/GeneratorApp.css";

let pluginModule = require('../Plugins');
/*
* This component represents the right webpage division. This will
* contain the generated code.
*/


class CodeViewer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      text: null
    };

    var request = require('request');
    let url = 'http://127.0.0.1:2379/v2/keys/testKey?wait=true';
    function getBody(url, callback) {
      request({
        url: url,
        json: true
      }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          return callback(error || {statusCode: response.statusCode});
        }
        callback(null, body); 
      });
    }
    
    getBody(url, function(err, body) {
      if (err) {
        console.log(err);
      } else {
        pluginModule.generatedCode = body.node.value;
        expect(pluginModule.generatedCode).to.be.an('string');

        console.log(pluginModule.generatedCode)
      }
    });
  }
  
  
  render() {
    return (
      <div className="body">
        <div className="split right-viewer">
          <p className="whitetextgen">{this.props.generatedCode}</p>
        </div>
      </div>
    );
  }
};
export default CodeViewer;

//CodeViewer.propTypes = {}
