import React from 'react'
import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';

let pluginPickedArray =  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
let offsets = [[0],[3],[7],[9],[11],[17]];

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
class PluginApp extends React.Component {
    constructor() {
        super();
        this.handleData = this.handleData.bind(this);
        this.state = {
          clickedIndex: null,
          pluginNames: ['REST API',  'GRPC',       'PROMETHEUS',   'ETCD',      
                        'REDIS',     'CASSANDRA',  'CONSUL',       'LOGRUS',     
                        'LOG MNGR',  'STTS CHECK', 'PROBE',        'KAFKA',     
                        'DATASYNC',  'IDX MAP',    'SRVC LABEL',   'CONFIG'],

          sentInNames: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.']
        };
    }
    
    handleData = (index) => {
        this.setState({
          clickedIndex: index
        });
        pluginPickedArray[index] = !pluginPickedArray[index];
    }

    render() {
        return (
            <div>
                <div className="left-column-background">
                <p>hello</p>
                </div>
                <div className="plugin-column">
                    {this.state.sentInNames.map((sentInName, index) => {
                        return (
                            <PluginPicker 
                                key={index} 
                                sentInName={sentInName} 
                                sentInArray={pluginPickedArray.subarray(Number(offsets[index]),Number(offsets[index+1]))}>
                                {this.state.pluginNames.slice(Number(offsets[index]), Number(offsets[index+1])).map((pluginName, pluginNameIndex) => {
                                    return (
                                        <DraggablePlugins
                                            pluginName={pluginName}
                                            handlerFromParent={this.handleData}
                                            id={pluginNameIndex+Number(offsets[index])}
                                            key={pluginNameIndex+Number(offsets[index])} 
                                        />
                                    )
                                })}     
                            </PluginPicker>
                        )
                    })}
                </div>
                <PluginPalette                                                      
                    sentInArray={pluginPickedArray}>
                    {this.state.pluginNames.map((pluginName, pluginNameIndex) => {
                        return (<DraggablePlugins
                            pluginName={pluginName}
                            key={pluginNameIndex}
                            id={pluginNameIndex}
                            handlerFromParent={this.handleData}
                        />)
                    })}   
                </PluginPalette>
            </div>
        );
    }
}
export default PluginApp;