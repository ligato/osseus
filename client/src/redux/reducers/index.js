import { ADD_PLUGIN_ARRAY } from "../constants/action-types";
import { SAVE_ARRAY } from "../constants/action-types";
import { SET_CURR_ARRAY } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";

const initialState = {
  currPopupID: null,
  projects: [],
  currProject: [],
  savedPlugins: {}
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
  } else if (action.type === SET_CURR_POPUP_ID) {
    return Object.assign({}, state, {
      currPopupID: action.payload
    });
  }
  return state;
}
export default rootReducer;