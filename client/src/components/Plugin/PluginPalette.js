import React from 'react';
import "../../styles/App.css";
import "../../styles/Plugin/Splitright.css";

/*This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const PluginPalette = (props) => {
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