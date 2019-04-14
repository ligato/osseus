import { ADD_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_PROJECT } from "../constants/action-types";
import { SET_CURR_POPUP_ID } from "../constants/action-types";
import { SAVE_PROJECT_TO_KV } from "../constants/action-types";
import { LOAD_PROJECT_FROM_KV } from "../constants/action-types";
import { GENERATE_CURR_PROJECT } from "../constants/action-types";
import { DELIVER_GENERATED_TAR } from "../constants/action-types";

export function addCurrProject(payload) {
  return { type: ADD_CURR_PROJECT, payload };
}

export function setCurrProject(payload) {
  return { type: SET_CURR_PROJECT, payload };
}

export function setCurrPopupID(payload) {
  return { type: SET_CURR_POPUP_ID, payload };
}

export function saveProjectToKV(payload) {
  return { type: SAVE_PROJECT_TO_KV, payload }
}

export function loadProjectFromKV(payload) {
  return { type: LOAD_PROJECT_FROM_KV, payload }
}

export function generateCurrProject(payload) {
  return { type: GENERATE_CURR_PROJECT, payload };
}

export function deliverGeneratedTar(payload) {
  return { type: DELIVER_GENERATED_TAR, payload };
}
