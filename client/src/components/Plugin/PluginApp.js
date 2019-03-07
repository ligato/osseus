import React from 'react'
import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';

//offsets allows me to differentiate between categories of plugins
//while looping through the unique components
const offsets = [[0],[3],[7],[9],[11],[17]];
let pluginPickedArray =  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

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

      sentInCategories: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.']
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
        <div className="left-column-background"></div>
          <div className="plugin-column">
            {this.state.sentInCategories.map((sentInCategory, index) => {
              return (
                <PluginPicker 
                  key={index} 
                  sentInCategory={sentInCategory} 
                  sentInArrayObject={pluginPickedArray.subarray(Number(offsets[index]),Number(offsets[index+1]))}
                >
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
          <PluginPalette sentInArrayObject={pluginPickedArray}>
            {this.state.pluginNames.map((pluginName, pluginNameIndex) => {
              return (
                <DraggablePlugins
                  pluginName={pluginName}
                  handlerFromParent={this.handleData}
                  id={pluginNameIndex}
                  key={pluginNameIndex}
                />
              )
            })}   
          </PluginPalette>
      </div>
    );
  }
}
export default PluginApp;