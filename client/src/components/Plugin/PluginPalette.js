import React from 'react';
import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitright.css";

/*
* This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const PluginPalette = (props) => {
  var pluginArray = React.Children.toArray(props.children);
  for(let i = props.sentInArrayObject.length; i >= 0; i--) {
    if(props.sentInArrayObject[i] === 0) { pluginArray.splice(i,1); }
  }

  return (
    <div className="body">
      <div className="split right">
        <div className="centered">
          {pluginArray}
        </div>
        <div className="rectangle">
          <p className="whitetext">Base Plugin</p>
        </div>
      </div>
    </div>
  );
};
export default PluginPalette;

PluginPalette.propTypes = {
  sentInArrayObject:   PropTypes.object.isRequired,
}