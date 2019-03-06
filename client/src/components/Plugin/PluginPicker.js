import React from 'react';
import "../../styles/App.css";
import "../../styles/Plugin/Splitleft.css";

/*
* This component represents the left webpage division where the
* plugins will reside initially. The plugins are being represented
* by the incoming prop.children. Presumedly in the future the 
* prop children can be stored in an array instead of initializing
* one-by-one.
*/
const PluginPicker = (props) => {
    /*
    * The following code block will initlize an array of prop objects that are sent in from 
    * PluginApp.js in order to manipulate which prop objects are rendered. In the case of 
    * PluginPicker.js a sent in DraggablePlugin object is only rendered if the boolean
    * element at the index of the ID of said object within sentInArray is equal to 0.
    * 
    * ie. sentInArray = {0, 1, 0, 1}  --> objects with id: 0, 2 will render in the PluginPicker.
    */
    var pluginArray = React.Children.toArray(props.children);
    for(let i = props.sentInArray.length; i >= 0; i--) {
        if(props.sentInArray[i] === 1) { pluginArray.splice(i,1); }
    }
    
    return (
        <div className="body">
            <div>
                <p className="pluginheadingtext">{props.sentInName}</p>
                <div className="grid-container">
                    {pluginArray}
                </div>
            </div>
        </div>
    );
};

export default PluginPicker;
