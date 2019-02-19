import React from 'react';
import "../styles/App.css";
import "../styles/Splitleft.css";

/*This component represents the left webpage division where the
* plugins will reside initially. The plugins are being represented
* by the incoming prop.children. Presumedly in the future the 
* prop children can be stored in an array instead of initializing
* one-by-one.
*/
const PluginPickerMISC = (props) => {
    return (
        <div className="body">
            <div className="split leftMISC">
                <p className="pluginheadingtext">Misc.</p>
                <div className="grid-container">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default PluginPickerMISC;

//<h2 class="whitetext">Plugin Picker</h2>
//<p class="whitetext">Initial Placement of Plugin Tiles</p>