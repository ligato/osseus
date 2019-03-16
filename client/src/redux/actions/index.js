import { ADD_PLUGIN_ARRAY } from "../constants/action-types";
import { SAVE_ARRAY } from "../constants/action-types";
import { SET_CURR_ARRAY } from "../constants/action-types";

export function addPluginArray(payload) {
  return { type: ADD_PLUGIN_ARRAY, payload };
}

export function saveArray(payload) {
  return {type: SAVE_ARRAY, payload};
} 

export function setCurrArray(payload) {
  return {type: SET_CURR_ARRAY, payload};
}
