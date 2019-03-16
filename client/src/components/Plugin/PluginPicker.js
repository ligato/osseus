import React from 'react';
//import PropTypes from 'prop-types'
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
  //This will loop through pluginArray splicing out elements based
  //on if the element of sentInArrayObject at the index of the 
  //current counter (i) is === 1. The net result is that if for example 
  //sentInArrayObject = [0,1,1,0], plugins with the id attribute 0 and 3
  //are rendered within PluginPicker and not PluginPalette.
  for(let i = props.sentInArrayObject.length; i >= 0; i--) {
    if(props.sentInArrayObject[i] === 1 || props.sentInArrayObject[i] === true) { pluginArray.splice(i,1); }
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

/*PluginPicker.propTypes = {
  sentInCategory:      PropTypes.string.isRequired,
  sentInArrayObject:   PropTypes.object.isRequired,
}*/
