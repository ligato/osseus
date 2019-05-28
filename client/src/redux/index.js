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

