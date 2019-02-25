import React, { Component } from "react";
import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';
import GeneratorButton from './GeneratorButton';
import "../styles/App.css";
import { BrowserRouter } from 'react-router-dom';


//These are temporary arrays, only one array will be used later on.
let pluginArray =  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

/*
* The class and its member function are used to recieve data from children; currently it captures 
* the id of a clicked plugin and uses it to flip (1 or 0) the element at the index of the passed in id.
*     Pre state of array = {0,0,0,0}
*
*       1. Plugin with the id 0 is clicked
*       2. That id is captured by the parent (App.js).
*       3. This id is used to flip the element at the index id.
*
*     Post state of array = {1,0,0,0}
*/
class App extends Component {
    constructor() {
        super();
        this.handleData = this.handleData.bind(this);
        this.state = {
          clickedIndex: null
        };
    }
    
    handleData = (index) => {
        this.setState({
          clickedIndex: index
        });
        pluginArray[index] = !pluginArray[index];
    }
    render() {
        /*
        * This huge block of code could likely be compressed into objects but for testing this will be
        * openly displayed exactly where its being used for testing and understanding purposes.
        *
        * This block of code outlines the structure of whats a child of what, what props are being passed where
        * etc.
        *
        * Structure:  
        *                   App.js     ..................... (parent)
        *                 /       \
        *        PPicker.js        PPalette.js    .......... (child)
        *            /                 \
        *   DPlugins.js                DPlugins.js     ..... (sub-child)
        */ 
        return (
            <div> 
                <PluginPicker sentInStyle = "split leftRPC"  sentInName="RPC"        sentInArray={pluginArray.subarray(0,3)}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "REST API"  grouping = "RPC"  id={0} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "GRPC"      grouping = "RPC"  id={1} />    
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "PROMETHEUS"grouping = "RPC"  id={2} />          
                </PluginPicker>
                <PluginPicker sentInStyle = "split leftDS"   sentInName="Data Store" sentInArray={pluginArray.subarray(3,7)}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "ETCD"      grouping = "DS"   id={3} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "REDIS"     grouping = "DS"   id={4} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CASSANDRA" grouping = "DS"   id={5} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CONSUL"    grouping = "DS"   id={6} />          
                </PluginPicker>
                <PluginPicker sentInStyle = "split leftLOG"  sentInName="Logging"    sentInArray={pluginArray.subarray(7,9)}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "LOGRUS"    grouping = "LOG"  id={7} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "LOG MNGR"  grouping = "LOG"  id={8} />           
                </PluginPicker>
                <PluginPicker sentInStyle = "split leftHTH"  sentInName="Health"     sentInArray={pluginArray.subarray(9,11)}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "STTS CHECK"grouping = "HTH"  id={9} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "PROBE"     grouping = "HTH"  id={10} />             
                </PluginPicker>
                <PluginPicker sentInStyle = "split leftMISC" sentInName="Misc."      sentInArray={pluginArray.subarray(11,17)}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "KAFKA"     grouping = "MISC" id={11} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "DATASYNC"  grouping = "MISC" id={12} />     
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "IDX MAP"   grouping = "MISC" id={13} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "SRVC LABEL"grouping = "MISC" id={14} />    
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CONFIG"    grouping = "MISC" id={15} />        
                </PluginPicker>
                <PluginPalette                                                       sentInArray={pluginArray}>
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "REST API"  grouping = "RPC"  id={0} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "GRPC"      grouping = "RPC"  id={1} />    
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "PROMETHEUS"grouping = "RPC"  id={2} />
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "ETCD"      grouping = "DS"   id={3} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "REDIS"     grouping = "DS"   id={4} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CASSANDRA" grouping = "DS"   id={5} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CONSUL"    grouping = "DS"   id={6} /> 
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "LOGRUS"    grouping = "LOG"  id={7} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "LOG MNGR"  grouping = "LOG"  id={8} />  
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "STTS CHECK"grouping = "HTH"  id={9} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "PROBE"     grouping = "HTH"  id={10} />  
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "KAFKA"     grouping = "MISC" id={11} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "DATASYNC"  grouping = "MISC" id={12} />     
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "IDX MAP"   grouping = "MISC" id={13} />   
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "SRVC LABEL"grouping = "MISC" id={14} />    
                    <DraggablePlugins  handlerFromParent={this.handleData}  pluginName = "CONFIG"    grouping = "MISC" id={15} />  
                    <BrowserRouter>
                        <GeneratorButton />
                    </BrowserRouter>  
                </PluginPalette>
            </div>
        );
    }
}



export default App;
