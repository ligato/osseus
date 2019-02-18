import React from 'react';
import "../styles/App.css";
import "../styles/Splitleft.css";

/*This component represents the left webpage division where the
* plugins will reside initially. The plugins are being represented
* by the incoming prop.children. Presumedly in the future the 
* prop children can be stored in an array instead of initializing
* one-by-one.
*/
const PluginPickerRPC = (props) => {
    return (
        <div className="body">
            <div className="split leftRPC">
                <p className="pluginheadingtext">RPC</p>
                <div className="grid-container">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default PluginPickerRPC;

//<h2 class="whitetext">Plugin Picker</h2>
//<p class="whitetext">Initial Placement of Plugin Tiles</p>