import React from 'react';
import "../styles/App.css";
import "../styles/Splitleft.css";

/*This component represents the left webpage division where the
* plugins will reside initially. The plugins are being represented
* by the incoming prop.children. Presumedly in the future the 
* prop children can be stored in an array instead of initializing
* one-by-one.
*/
const PluginPicker = (props) => {
    var pluginArray = React.Children.toArray(props.children);
    for(let i = props.sentInArray.length; i >= 0; i--) {
        if(props.sentInArray[i] === 1) { pluginArray.splice(i,1); }
    }
    
    return (
        <div className="body">
            <div className={props.sentInStyle}>
                <p className="pluginheadingtext">{props.sentInName}</p>
                <div className="grid-container">
                    {pluginArray}
                </div>
            </div>
        </div>
    );
};

export default PluginPicker;
