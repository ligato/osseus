import React from 'react';
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
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
  for(let i = props.sentInArray.length; i >= 0; i--) {
    if(props.sentInArray[i] === 1 || props.sentInArray[i] === true) { pluginArray.splice(i,1); }
  }

  function handleHeadingClick(heading) {
    if(heading === 'Custom') {
      (async () => {
        let customPluginData = await getName();
        if(!customPluginData) return;
        props.sendCustomPlugin(customPluginData);
      })()
    }
  }
 
  return (
    <div className="body">
      <p 
        className={props.sentInCategory === 'Custom' ? "custom-heading":"pluginheadingtext"} 
        onClick={() => {handleHeadingClick(props.sentInCategory)}}>
          {props.sentInCategory}
      </p>
      {props.sentInCategory === 'Custom' ? 
        <img
          className="add-plugin-image"
          src='/images/add.png'
          alt='oops'
          onClick={() => {handleHeadingClick('Custom')}}
          data-tip="New Plugin">
        </img>
        : null
      }
      <div className="grid-container" style={{borderColor : (props.sentInCategory === 'Custom' ? "white" : "#CECECE")}}>
        {pluginArray}
      </div>
      <ReactTooltip
        place="bottom"
        effect="solid"
      />
    </div>
  );
};
export default PluginPicker;

PluginPicker.propTypes = {
  sentInCategory:      PropTypes.string.isRequired,
  sentInArray:         PropTypes.array.isRequired,
}

async function getName () {
  const {value: formValues} = await Swal.fire({
    title: 'Custom Plugin',
    html:
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Name:</p><input style="float:right; width: 300px" id="swal-input1"></div>' +
      '<div style="display:inline-block; width: 400px;"><p style="float: left; width: 100px;">Package:</p><input style="float:right; width: 300px" id="swal-input2"></div>',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  })
  return formValues;
}
 /* function sendPluginData(data) {
    let customPluginCopy = JSON.parse(JSON.stringify( customPlugin ));
    customPluginCopy.customPluginName = data[0];
    customPluginCopy.package = data[1];
    pluginModule.project.customPlugins.push(customPluginCopy);
  }
}*/