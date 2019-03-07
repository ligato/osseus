import React from 'react';
import "../../styles/App.css";
import "../../styles/Plugin/Splitright.css";

/*
* This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const PluginPalette = (props) => {
    /*
    * The following code block will initlize an array of prop objects that are sent in from 
    * PluginApp.js in order to manipulate which prop objects are rendered. In the case of 
    * PluginPalette.js a sent in DraggablePlugin object is only rendered if the boolean
    * element at the index of the ID of said object within sentInArray is equal to 1.
    * 
    * ie. sentInArray = {0, 1, 0, 1}  --> objects with id: 1, 3 will render in the PluginPalette.
    */
    var pluginArray = React.Children.toArray(props.children);
    for(let i = props.sentInArray.length; i >= 0; i--) {
        if(props.sentInArray[i] === 0) { pluginArray.splice(i,1); }
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