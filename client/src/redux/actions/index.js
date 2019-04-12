import { ADD_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";
import { SAVE_PROJECT } from "../constants/action-types";
import { LOAD_PROJECT } from "../constants/action-types";

export function addCurrProject(payload) {
  return { type: ADD_CURR_PROJECT, payload };
}

export function setCurrProject(payload) {
  return { type: SET_CURR_PROJECT, payload };
}

export function setCurrPopupID(payload) {
  return { type: SET_CURR_POPUP_ID, payload };
}

export function saveProject(payload) {
  return { type: SAVE_PROJECT, payload }
}

export function loadProject(payload) {
  return { type: LOAD_PROJECT, payload }
}
