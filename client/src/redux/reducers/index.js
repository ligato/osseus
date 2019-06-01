// Used by UI
import { ADD_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";

// Sent to server
import { GENERATE_CURR_PROJECT } from "../constants/action-types";
import { DELETE_PROJECT } from "../constants/action-types";
import { LOAD_ALL_PROJECTS } from "../constants/action-types";
import { LOAD_PROJECT_FROM_KV } from "../constants/action-types";
import { SAVE_PROJECT_TO_KV } from "../constants/action-types";
import { DOWNLOAD_TAR } from "../constants/action-types";

// Returned from server
import { RETURN_LOAD_PROJECT } from "../constants/action-types";
import { RETURN_TEMPLATE } from "../constants/action-types";

import { socket } from '../../index';

var initialState = {
  currPopupID: null,
  projects: [],
  currProject: null,
  template: null,
};
function rootReducer(state = initialState, action) {
  //Add the current project to the array of saved projects
  if (action.type === ADD_CURR_PROJECT) {
    return Object.assign({}, state, {
      projects: state.projects.concat(action.payload)
    });
  }
  //Makes the project the current project in redux
  else if (action.type === SET_CURR_PROJECT) {
    return Object.assign({}, state, {
      currProject: action.payload
    });
  }
  //Set the popup id of the clicked plugin in redux for use
  //as a global
  else if (action.type === SET_CURR_POPUP_ID) {
    return Object.assign({}, state, {
      currPopupID: action.payload
    });
  }
  //Retreives the loaded project from the backend server
  else if (action.type === RETURN_LOAD_PROJECT) {
    return Object.assign({}, state, {
      projects: state.projects.concat(action.payload)
    })
  }
  //Retreives the template from the server
  else if (action.type === RETURN_TEMPLATE) {
    return Object.assign({}, {
      template: state.projects.concat(action.template)
    })
  }
  //Emits the server to call GENERATE_PROJECT
  else if (action.type === GENERATE_CURR_PROJECT) {
    socket && socket.emit('GENERATE_PROJECT', action.payload);
  }
  //Emits the server to call DELETE_PROJECT_FROM_KV
  else if (action.type === DELETE_PROJECT) {
    socket && socket.emit('DELETE_PROJECT_FROM_KV', action.payload)
  }
  //Emits the server to call LOAD_ALL_FROM_KV
  else if (action.type === LOAD_ALL_PROJECTS) {
    socket && socket.emit('LOAD_ALL_FROM_KV', action.payload)
  }
  //Emits the server to call SEND_LOAD_PROJECT
  else if (action.type === LOAD_PROJECT_FROM_KV) {
    socket && socket.emit('SEND_LOAD_PROJECT', action.payload)
  }
  //Emits the server to call SEND_SAVE_PROJECT
  else if (action.type === SAVE_PROJECT_TO_KV) {
    socket && socket.emit('SEND_SAVE_PROJECT', action.payload)
  }
  //Emits the server to call DOWNLOAD_TAR
  else if (action.type === DOWNLOAD_TAR) {
    socket && socket.emit('DOWNLOAD_TAR', action.payload)
  }
  return state;
}
export default rootReducer;
