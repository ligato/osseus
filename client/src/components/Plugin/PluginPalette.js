import React from 'react';
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitright.css";


let pluginModule = require('../Model');

const toolText = {
  generate: 'Once finished, generate a template.',
  header: 'Configure and save projects. Once finished, generate a template.',
  pluginPicker: 'Pick from a set of plugins or make your own.',
  agent: 'Choose agent settings.'
}
let textVisibilty = 'visible';

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
  if(props.sentInArray.includes(1)) textVisibilty = 'hidden';
  else textVisibilty = 'visible';

  return (
    <div>
      <div >
        <div className="split right">
          <div className="grid-div">
            <div className="grid-container-right">
              {pluginArray}
            </div>
          </div>
          <div className="tool-text-container" style={{visibility: textVisibilty}}>
            <p className="tool-text-header">{toolText.generate}&nbsp;<i className="up-arrow"></i></p>
            <div className="tool-text-div">
              <p className="tool-text"><i className="up-arrow"></i>&nbsp;{toolText.header}</p><br></br>
              <p className="tool-text"><i className="left-arrow"></i>&nbsp;{toolText.pluginPicker}</p><br></br>
              <p className="tool-text"><i className="down-arrow"></i>&nbsp;{toolText.agent}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="split right-bottom">
        <div className="rectangle">
          <img
            className="settings-image"
            src='/images/settings.png'
            alt='oops'
            data-tip="Agent Settings"
            onClick={handleNewAgentName}>
          </img>
          <div className="agent-text">
            <p className="agent-name">Agent</p>
          </div>
        </div>
        <img
          className="cisco-logo-gray"
          src='/images/cisco-logo.png'
          alt='oops'>
        </img>
      </div>
    </div>
  );
};
export default PluginPalette;

PluginPalette.propTypes = {
  sentInArray:   PropTypes.array.isRequired,
}

function handleNewAgentName() {
  (async () => {
    let nameCapture = await getAgentName();
    if(!nameCapture) return;
    pluginModule.project.agentName = nameCapture[0];
    console.log(pluginModule.project.agentName)
  })()
}

async function getAgentName () {
  const inputStyling = `<div style="display:inline-block; width: 300px;">
                          <p style="float: left; width: 100px; margin-bottom: -15px;">Agent Name:</p>
                          <input style="float: left; width: 300px; margin-top: 20px;" id="swal-input1" value="${pluginModule.project.agentName}">
                        </div>`
  const {value: formValues} = await Swal.fire({
    showCancelButton: false,
    width: '24rem',
    position: 'bottom',
    heightAuto: 'false',
    allowEnterKey: true,
    showCloseButton: true,
    html: inputStyling,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
      ]
    }
  })
  return formValues;
}