// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

export function addCurrProject(payload) {
  return { type: ADD_CURR_PROJECT, payload };
}
export function setCurrProject(payload) {
  return { type: SET_CURR_PROJECT, payload };
}
export function setCurrPopupID(payload) {
  return { type: SET_CURR_POPUP_ID, payload };
}

export function generateCurrProject(payload) {
  return { type: GENERATE_CURR_PROJECT, payload };
}
export function deleteProject(payload) {
  return { type: DELETE_PROJECT, payload }; 
}
export function loadAllProjects(payload) {
  return { type: LOAD_ALL_PROJECTS, payload };
}
export function loadProjectFromKV(payload) {
  return { type: LOAD_PROJECT_FROM_KV, payload }
}
export function saveProjectToKV(payload) {
  return { type: SAVE_PROJECT_TO_KV, payload }
}
export function downloadTar(payload) {
  return { type: DOWNLOAD_TAR, payload };
}


export function returnLoadProject(payload) {
  return { type: RETURN_LOAD_PROJECT, payload }; 
}
export function returnTemplate(payload) {
  return { type: RETURN_TEMPLATE, payload }; 
}