import React, { Component } from "react";
import PluginPicker from './PluginPicker';
import PluginPalette from './PluginPalette';
import DraggablePlugins from './DraggablePlugins';
import "./styles/App.css";

class App extends Component {
  render() {
    return (
        <div>         
            <PluginPicker>
                <DraggablePlugins />      
            </PluginPicker>
            <PluginPalette />
        </div>
    );
  }
}

export default App;
