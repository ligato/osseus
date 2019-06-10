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

import store from "../redux/store/index";
// Used by UI
import { addCurrProject } from "../redux/actions/index";
import { setCurrProject } from "../redux/actions/index";
import { setCurrPopupID } from "../redux/actions/index";
// Sent to server
import { generateCurrProject } from "../redux/actions/index";
import { deleteProject } from "../redux/actions/index";
import { loadAllProjects } from "../redux/actions/index";
import { loadProjectFromKV } from "../redux/actions/index";
import { saveProjectToKV } from "../redux/actions/index";
import { downloadTar } from "../redux/actions/index";
// Returned from server
import { returnLoadProject } from "../redux/actions/index";
import { returnTemplate } from "../redux/actions/index";

window.store = store;

window.addCurrProject = addCurrProject;
window.setCurrProject = setCurrProject;
window.setCurrPopupID = setCurrPopupID;

window.generateCurrProject = generateCurrProject;
window.deleteProject = deleteProject;
window.loadAllProjects = loadAllProjects;
window.loadProjectFromKV = loadProjectFromKV;
window.saveProjectToKV = saveProjectToKV;
window.downloadTar = downloadTar;

window.returnLoadProject = returnLoadProject;
window.returnTemplate = returnTemplate;
