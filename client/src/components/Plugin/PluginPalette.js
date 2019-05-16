import React from 'react';
import PropTypes from 'prop-types'
import Dropdown from './CustomPluginDropdown';
import ContentEditable from 'react-contenteditable'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitright.css";


let pluginModule = require('../Model');



/*
* This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const PluginPalette = (props) => {
  var pluginArray = React.Children.toArray(props.children);
  //This will loop through pluginArray splicing out elements based
  //on if the element of sentInArrayObject at the index of the 
  //current counter (i) is === 0. The net result is that if for example 
  //sentInArrayObject = [0,1,1,0], plugins with the id attribute 1 and 2
  //are rendered within PluginPalette and not PluginPicker.
  for(let i = props.sentInArray.length; i >= 0; i--) {
    if(props.sentInArray[i] === 0 || props.sentInArray[i] === false) { pluginArray.splice(i,1); }
  }

  function handleEditedProjectName(evt) {
    let editedProjectName = evt.target.value;
    pluginModule.project.agentName = editedProjectName;
  }

  return (
    <div>
      <div >
        <div className="split right">
          <div className="new-custom-plugin-div">
            <Dropdown/>
          </div>
          <div className="grid-container-right">
            {pluginArray}
          </div>
        </div>
      </div>
      <div className="split right-bottom">
        <div className="rectangle">
          <div className="agent-text">
            <p className="currentproject">Agent: </p>
            <ContentEditable
              spellCheck={false}
              className="agent-name"
              html={pluginModule.project.agentName} // innerHTML of the editable div
              disabled={false} // use true to disable edition
              onChange={handleEditedProjectName} // handle innerHTML change
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PluginPalette;

PluginPalette.propTypes = {
  sentInArray:   PropTypes.array.isRequired,
}