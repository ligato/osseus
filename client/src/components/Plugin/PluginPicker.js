import React from 'react';
import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Splitleft.css";

/*
* This component represents the left webpage division where the
* plugins will reside initially. The plugins are being represented
* by the incoming prop.children. Presumedly in the future the 
* prop children can be stored in an array instead of initializing
* one-by-one.
*/
const PluginPicker = (props) => {
  var pluginArray = React.Children.toArray(props.children);
  for(let i = props.sentInArrayObject.length; i >= 0; i--) {
    if(props.sentInArrayObject[i] === 1) { pluginArray.splice(i,1); }
  }
 
  return (
    <div className="body">
      <p className="pluginheadingtext">{props.sentInCategory}</p>
      <div className="grid-container">
        {pluginArray}
      </div>
    </div>
  );
};
export default PluginPicker;

PluginPicker.propTypes = {
  sentInCategory:      PropTypes.string.isRequired,
  sentInArrayObject:   PropTypes.object.isRequired,
}
