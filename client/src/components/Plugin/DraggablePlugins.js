import React from 'react';
import PropTypes from 'prop-types'
import "../../styles_CSS/App.css";
import "../../styles_CSS/Plugin/Plugincard.css";

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
    //this.handleClick = this.handleClick.bind(this);
  }

  /*
  * This function captures the event and determines the id of the clicked plugin.
  * This id is in turn sent up to PluginApp.js in order to tick the element at 
  * the index of the id.
  */
  handleClick = e => { 
    e.preventDefault();
    this.props.handlerFromParent(e.currentTarget.dataset.id);
  }
  
  render() {
    return ( 
      <div className="cardbody" data-id={this.props.id} onClick={this.handleClick}>
        <div>
          <img 
            src={window.location.origin + this.props.image}
            alt="Avatar"></img>
          <div>
            <p className="cardtext">{this.props.pluginName}</p>
          </div>
        </div>
      </div>
    );
  }
};
export default DraggablePlugins;

DraggablePlugins.propTypes = {
  pluginName:         PropTypes.string.isRequired,
  image:              PropTypes.string.isRequired,
  handlerFromParent:  PropTypes.func.isRequired,
  id:                 PropTypes.number.isRequired,
}