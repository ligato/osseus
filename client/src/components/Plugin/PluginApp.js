import React from 'react'
import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';
import store from '../../redux/store/index';
import { saveArray, setCurrArray } from "../../redux/actions/index";
import 'chai/register-expect';

/*
* OFFSET allows me to differentiate between categories of plugins
* while looping through the unique components, the first 3 plugins
* are their own category, the next 4 their own and so on.
*/
const { expect } = require('chai');
const OFFSET = [[0],[3],[7],[9],[11],[17]];
let pluginModule = require('../Plugins');
let pluginPickedArray;
let visiblityArray;
store.dispatch( setCurrArray([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));

class PluginApp extends React.Component {
  constructor() {
    super();
    pluginPickedArray = store.getState().currProject;
    expect(pluginPickedArray).to.have.lengthOf(16);

    visiblityArray = buildVisiblityArray();
    expect(visiblityArray).to.have.lengthOf(16);

    this.handleData = this.handleData.bind(this);
    this.state = {
      clickedIndex: null,
      sentInCategories: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.']
    };
  }
    
  //Captures incoming id from DraggablePlugins.js for use as an index
  //to flip the value at that index of pluginPickedArray.
  handleData = (index) => {
    this.setState({
      clickedIndex: index
    });
    pluginPickedArray[index] = !pluginPickedArray[index]*1;
    pluginModule.plugins[index].selected = !pluginModule.plugins[index].selected;
    store.dispatch(saveArray(pluginModule.plugins));
    if(pluginPickedArray[index] === 0) {
      visiblityArray[index] = 'hidden';
    } else {
      visiblityArray[index] = 'visible';
    }
  }

  render() {
    return (
      <div>
        <div className="left-column-background"></div>
          <div className="plugin-column">
            {this.state.sentInCategories.map((sentInCategory, outerIndex) => {
              return (
                <PluginPicker 
                  key={outerIndex} 
                  sentInCategory={sentInCategory} 
                  sentInArrayObject={pluginPickedArray.slice(Number(OFFSET[outerIndex]),Number(OFFSET[outerIndex+1]))}
                >
                  {pluginModule.plugins.slice(Number(OFFSET[outerIndex]), Number(OFFSET[outerIndex+1])).map((i, innerIndex) => {
                    return (
                      <DraggablePlugins
                        pluginName={pluginModule.plugins[Number(OFFSET[outerIndex]) + innerIndex].pluginName}
                        image={pluginModule.plugins[Number(OFFSET[outerIndex]) + innerIndex].image}
                        handlerFromParent={this.handleData}
                        id={Number(OFFSET[outerIndex]) + innerIndex}
                        key={Number(OFFSET[outerIndex]) + innerIndex} 
                        visibility={visiblityArray[Number(OFFSET[outerIndex]) + innerIndex]}
                      />
                    )
                  })}     
                </PluginPicker>
              )
            })}
          </div>
          <PluginPalette sentInArrayObject={pluginPickedArray}>
            {pluginModule.plugins.map((i, index) => {
              return (
                <DraggablePlugins
                  pluginName={pluginModule.plugins[index].pluginName}
                  image={pluginModule.plugins[index].image}
                  handlerFromParent={this.handleData}
                  id={index}
                  key={index}
                  visibility={visiblityArray[index]}
                />
              )
            })}   
          </PluginPalette>
      </div>
    );
  }
}
export default PluginApp;

function buildVisiblityArray() {
  var array = [];
  for(let i = 0; i < pluginPickedArray.length; i++) {
    if(pluginPickedArray[i] === 0) {
      array[i] = 'hidden';
    } else {
      array[i] = 'visible';
    }
  }
  return array;
}


