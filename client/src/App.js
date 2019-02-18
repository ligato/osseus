import React, { Component } from "react";

import PluginPickerRPC from './pluginpicker/PluginPicker_RPC';
import PluginPickerDS from "./pluginpicker/PluginPicker_DS";
import PluginPickerLOG from "./pluginpicker/PluginPicker_LOG";
import PluginPickerHTH from "./pluginpicker/PluginPicker_HTH";
import PluginPickerMISC from "./pluginpicker/PluginPicker_MISC";

import DraggablePlugins from './DraggablePlugins';

import PluginPalette from './PluginPalette'
import "./styles/App.css";

class App extends Component {
  render() {
    return (
        <div> 
            <PluginPickerRPC>
                <DraggablePlugins pluginName = "REST API" />   
                <DraggablePlugins pluginName = "GRPC" />    
                <DraggablePlugins pluginName = "PROMETHEUS" />          
            </PluginPickerRPC>

            <PluginPickerDS>
                <DraggablePlugins pluginName = "ETCD" /> 
                <DraggablePlugins pluginName = "REDIS" /> 
                <DraggablePlugins pluginName = "CASSANDRA" /> 
                <DraggablePlugins pluginName = "CONSUL" /> 
            </PluginPickerDS>

            <PluginPickerLOG>
                <DraggablePlugins pluginName = "LOGRUS" />   
                <DraggablePlugins pluginName = "LOG MNGR" />             
            </PluginPickerLOG>

            <PluginPickerHTH>
                <DraggablePlugins pluginName = "STTS CHECK" />   
                <DraggablePlugins pluginName = "PROBE" />             
            </PluginPickerHTH>

            <PluginPickerMISC>
                <DraggablePlugins pluginName = "KAFKA" />   
                <DraggablePlugins pluginName = "DATASYNC" />     
                <DraggablePlugins pluginName = "IDX MAP" />   
                <DraggablePlugins pluginName = "SRVC LABEL" />    
                <DraggablePlugins pluginName = "CONFIG" />         
            </PluginPickerMISC>
            <PluginPalette></PluginPalette>
        </div>
    );
  }
}

export default App;
