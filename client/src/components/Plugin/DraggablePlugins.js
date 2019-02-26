import React from 'react';
import "../../styles/App.css";
import "../../styles/Plugin/Plugincard.css";

/*
* This component represents the plugin cards. This compenent is
* a child of Plugin Picker. Once drag and drop is implemented 
* we capture the id of a clicked plugin and send that id to the parent
* App.js
*/ 
class DraggablePlugins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          index: null
        };
        this.handleClick = this.handleClick.bind(this);
    }

    //This function is called onClick and it captures the event and 
    //determines the id of the clicked plugin. 
    handleClick = (e) => {
        e.preventDefault();
        this.props.handlerFromParent(e.currentTarget.dataset.id);
    }
    
    render() {
        return ( 
            <div className="cardbody" key={this.props.id} data-id={this.props.id} onClick={(this.handleClick)}>
                <div className="card">
                    <img src="https://i.ibb.co/r6VkQ19/Wordpress-Movie-Theme-Free.png" alt="Avatar"></img>
                    <div>
                        <p className="cardtext">{this.props.pluginName}</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default DraggablePlugins;