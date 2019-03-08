import React from 'react'
import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';

/*
* Offsets allows me to differentiate between categories of plugins
* while looping through the unique components, the first 3 plugins
* are their own category, the next 4 their own and so on.
*/ 
const offsets = [[0],[3],[7],[9],[11],[17]];
let pluginPickedArray =  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

class PluginApp extends React.Component {
  constructor() {
    super();
    this.handleData = this.handleData.bind(this);

    //Defining all important plugin data for looping.
    this.state = {
      clickedIndex: null,
      pluginNames: ['REST API',  'GRPC',       'PROMETHEUS',   'ETCD',      
                    'REDIS',     'CASSANDRA',  'CONSUL',       'LOGRUS',     
                    'LOG MNGR',  'STTS CHECK', 'PROBE',        'KAFKA',     
                    'DATASYNC',  'IDX MAP',    'SRVC LABEL',   'CONFIG'],

      sentInCategories: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.']
    };
  }
    
  //Captures incoming id from DraggablePlugins.js for use as an index
  //to flip the value at that index of pluginPickedArray.
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
            {
              //Starting here is the outer loop defining each PluginPicker. 
              //.map will loop for the length of sentInCategories with 
              //index as the counter. Index is used to reference 
              //different values within offsets which are themselves used
              //to define which pluginPickedArray subarray is sent as a prop 
              //to each PluginPicker  
            }
            {this.state.sentInCategories.map((sentInCategory, index) => {
              return (
                <PluginPicker 
                  key={index} 
                  sentInCategory={sentInCategory} 
                  sentInArrayObject={pluginPickedArray.subarray(Number(offsets[index]),Number(offsets[index+1]))}
                >
                  {
                    //Starting here is the inner loop defining each DraggablePlugin
                    //within each PluginPicker. Which DraggablePlugins are apart
                    //of which PluginPicker is manipulated again by the different
                    //values within offsets. In this case, referenced by pluginNameIndex.
                    //to define which pluginPickedArray subarray is sent as a prop 
                    //to each PluginPicker  
                  }
                  {this.state.pluginNames.slice(Number(offsets[index]), Number(offsets[index+1])).map((pluginName, pluginNameIndex) => {
                    return (
                      <DraggablePlugins
                        pluginName={pluginName}
                        image={'/images/walrus.png'}
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
            {
              //Similiar to the previous PluginPicker definition however,
              //since theres only one PluginPalette, all DraggablePlugins
              //are rendered within one component: PluginPalette. Therefore 
              //the loop isnt broken up into subarrays using offsets. The whole
              //pluginNames array is sent in.
            }
            {this.state.pluginNames.map((pluginName, pluginNameIndex) => {
              return (
                <DraggablePlugins
                  pluginName={pluginName}
                  image={'/images/walrus.png'}
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