import React from 'react';
import "./styles/App.css";

/*This component represents the main workspace. Users will be able to 
* Drag and Drop into the area that this component represents.
*/
const PluginPalette = () => {
    return (
        <div className="body">
            <div className="split right">
                <div className="centered">
                    <h2 className="whitetext">Plugin Palette</h2>
                    <p className="whitetext">Drag and Drop Plugins into the Plugin Palette</p>
                    <p className="whitetext">(Not Implemented)</p>
                </div>
                <div className="rectangle">
                    <p className="whitetext">Base Plugin</p>
                </div>
            </div>
        </div>
    );
};

export default PluginPalette;