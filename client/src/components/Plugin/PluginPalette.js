import React from 'react';
//import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitright.css";

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
  for(let i = props.sentInArrayObject.length; i >= 0; i--) {
    if(props.sentInArrayObject[i] === 0 || props.sentInArrayObject[i] === false) { pluginArray.splice(i,1); }
  }

  return (
    <div>
      <div className="body">
        <div className="split right">
          <div className="grid-container-right">
            {pluginArray}
          </div>
        </div>
      </div>
      <div className="split right-bottom">
        <div className="rectangle">
          <p className="whitetext">CN-infra</p>
        </div>
      </div>
    </div>
  );
};
export default PluginPalette;

/*PluginPalette.propTypes = {
  sentInArrayObject:   PropTypes.object.isRequired,
}*/