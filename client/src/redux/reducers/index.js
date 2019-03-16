import { ADD_PLUGIN_ARRAY } from "../constants/action-types";
import { SAVE_ARRAY } from "../constants/action-types";
import { SET_CURR_ARRAY } from "../constants/action-types";

let proj1 = [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1]
let proj2 = [0,0,1,1,0,1,0,0,1,0,1,0,1,0,1,1]
let proj3 = [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]

const initialState = {
  id: [0],
  currID: 0,
  projects: [proj1, proj2, proj3],
  currProject: [0],
  savedPlugins: [0]
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_PLUGIN_ARRAY) {
    return Object.assign({}, state, {
      projects: state.projects.concat(action.payload)
    });
  } else if (action.type === SAVE_ARRAY) {
    return Object.assign({}, state, {
      savedPlugins: action.payload
    });
  } else if (action.type === SET_CURR_ARRAY) {
    return Object.assign({}, state, {
      currProject: action.payload
    });
  }
  return state;
}
export default rootReducer;
