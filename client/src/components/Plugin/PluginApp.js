import React from 'react'
import 'chai/register-expect';
import Swal from 'sweetalert2'

import PluginPicker from './PluginPicker';
import DraggablePlugins from './DraggablePlugins';
import PluginPalette from './PluginPalette';
import Header from './Header/Header';
import store from '../../redux/store/index';
import { setCurrProject } from "../../redux/actions/index";

let pluginModule = require('../Model');
let visiblityArray;
const OFFSET = buildOFFSET();
store.dispatch( setCurrProject(pluginModule.project));


class PluginApp extends React.Component {
  constructor() {
    super();
    this.state = {
      sentInCategories: ['RPC', 'Data Store', 'Logging', 'Health', 'Misc.'], 
      pluginPickedArray: getPluginPickedArray(),
      currentProjectName: store.getState().currProject.projectName
    };
    this.handlePluginData = this.handlePluginData.bind(this);
    this.handleNewProject = this.handleNewProject.bind(this);
    this.handleLoadedProject = this.handleLoadedProject.bind(this);
    this.newProjectName = this.newProjectName.bind(this);
    visiblityArray = buildVisiblityArray(this.state.pluginPickedArray)
  }
    
  handlePluginData = (index) => {
    let tempArray = this.state.pluginPickedArray;
    tempArray[index] = !tempArray[index]*1;
    this.setState({
      pluginPickedArray: tempArray
    });
    pluginModule.project.plugins[index].selected = !pluginModule.project.plugins[index].selected;
    if(this.state.pluginPickedArray[index] === 0) {
      visiblityArray[index] = 'hidden';
    } else {
      visiblityArray[index] = 'visible';
    }
    store.dispatch( setCurrProject(pluginModule.project));
  }

  handleNewProject = () => {
    (async () => {
      let nameCapture = await getName();
      if(!nameCapture) return;
      if(nameCapture.length > 20){ 
        nameCapture = nameCapture.substring(0, 19) + '...'
        Swal.fire("Project names larger than 20 characters will be truncated!")
      }
      this.setState({
        currentProjectName: nameCapture
      });
      pluginModule.project.projectName = nameCapture;
    })()
    resetState();
    this.setState({
      pluginPickedArray: getPluginPickedArray()
    });
  }

  handleLoadedProject(name) {
    var selectedArray = getPluginPickedArray()
    this.setState({
      pluginPickedArray: selectedArray,
      currentProjectName: name
    });
    visiblityArray = buildVisiblityArray(selectedArray)
  }

  newProjectName(name) {
    this.setState({
      currentProjectName: name
    });
  }

  render() {
    return (
      <div>
        <Header
          newProjectHandlerFromParent={this.handleNewProject}
          newProjectNameHandler={this.newProjectName}
          loadedProjectHandlerFromParent={this.handleLoadedProject}
          currentProjectName={this.state.currentProjectName}
        />
        <div className="left-column-background"></div>
          <div className="plugin-column">
            {this.state.sentInCategories.map((sentInCategory, outerIndex) => {
              return (
                <PluginPicker 
                  key={outerIndex} 
                  sentInCategory={sentInCategory} 
                  sentInArray={this.state.pluginPickedArray.slice(Number(OFFSET[outerIndex]),Number(OFFSET[outerIndex+1]))}
                >
                  {pluginModule.project.plugins.slice(Number(OFFSET[outerIndex]), Number(OFFSET[outerIndex+1])).map((i, innerIndex) => {
                    return (
                      <DraggablePlugins
                        pluginName={pluginModule.project.plugins[Number(OFFSET[outerIndex]) + innerIndex].pluginName}
                        image={pluginModule.images[Number(OFFSET[outerIndex]) + innerIndex]}
                        handleClickedPlugin={this.handlePluginData}
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
          <PluginPalette sentInArray={this.state.pluginPickedArray}>
            {pluginModule.project.plugins.map((i, index) => {
              return (
                <DraggablePlugins
                  pluginName={pluginModule.project.plugins[index].pluginName}
                  image={pluginModule.images[index]}
                  handleClickedPlugin={this.handlePluginData}
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

async function getName () {
  const {value: text} = await Swal.fire({
    title: 'CN-infra Generator App',
    input: 'textarea',
    inputPlaceholder: 'New Project Name',
    showCancelButton: true,
    allowEnterKey:	true,
  })
  return text;
}

function resetState() {
  for(let i = 0; i < pluginModule.project.plugins.length; i++) {
    pluginModule.project.plugins[i].selected = false;
    pluginModule.project.plugins[i].port = 0;
  }
  store.dispatch( setCurrProject(pluginModule.project));
  visiblityArray = buildVisiblityArray(getPluginPickedArray())
}

function getPluginPickedArray() {
  let selectedArray = store.getState().currProject.plugins;
  let array = [];
  for(let i = 0; i < selectedArray.length; i++) {
    if(selectedArray[i].selected) array.push(Number(1))
    else array.push(Number(0)) 
  }
  return array;
}

function buildVisiblityArray(sentInArray) {
  var array = [];
  for(let i = 0; i < sentInArray.length; i++) {
    if(sentInArray[i] === 0) {
      array[i] = 'hidden';
    } else {
      array[i] = 'visible';
    }
  }
  return array;
}

function buildOFFSET() {
  let array = [[0]];
  var previouslength = 0;
  for(let i = 0; i < pluginModule.categories.length; i++) {
    let subarray = [pluginModule.categories[i].length + previouslength]
    array.push(subarray)
    previouslength = Number(array[i+1]);
  }
  console.log(array)
  return array;
}





