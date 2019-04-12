import { ADD_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";
import { SAVE_PROJECT } from "../constants/action-types";
import { LOAD_PROJECT } from "../constants/action-types";
import { RETURN_LOAD_PROJECT } from "../constants/action-types";
import { socket } from '../../index';


const initialState = {
  currPopupID: null,
  projects: [],
  currProject: null,
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_CURR_PROJECT) {
    return Object.assign({}, state, {
      projects: state.projects.concat(action.payload)
    });
  } else if (action.type === SET_CURR_PROJECT) {
    return Object.assign({}, state, {
      currProject: action.payload
    });
  } else if (action.type === SET_CURR_POPUP_ID) {
    return Object.assign({}, state, {
      currPopupID: action.payload
    });
    // Save project saves project to etcd
  } else if (action.type === SAVE_PROJECT) {
    socket.emit('SEND_SAVE_PROJECT', action.payload)
    // Load project gets requested project
  } else if (action.type === LOAD_PROJECT) {
    socket.emit('SEND_LOAD_PROJECT', action.payload)
    // Captures returned incoming loaded project
  } else if (action.type === RETURN_LOAD_PROJECT) {
    return Object.assign({}, state, {
      projects: state.projects.concat(action.payload)
    })
  }
  return state;
}
export default rootReducer;