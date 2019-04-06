import { ADD_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";


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
  } 
  return state;
}
export default rootReducer;