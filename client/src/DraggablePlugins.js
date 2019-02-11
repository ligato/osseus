import React from 'react';
import "./styles/App.css";

/*This component represented the plugin cards. This compenent is
* a child of Plugin Picker initially. Once drag and drop is implemented
* presumedly each instance of a "plugin" could change from being a child
* of the picker to being a child of palette once its is dragged over.
*/ 
const DraggablePlugins = () => {
    return (
        <div className="body">
            <div className="card">
                <img src="https://i.ibb.co/r6VkQ19/Wordpress-Movie-Theme-Free.png" alt="Avatar"></img>
                <div className="container">
                    <p className="whitetext">Plugin</p>
                </div>
            </div>
        </div>
    );
};

export default DraggablePlugins;