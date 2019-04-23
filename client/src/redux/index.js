import store from "../redux/store/index";
import { addCurrProject } from "../redux/actions/index";
import { setCurrProject } from "../redux/actions/index";
import { setCurrPopupID } from "../redux/actions/index";
import { generateCurrProject } from "../redux/actions/index";
import { deliverGeneratedTar } from "../redux/actions/index";
import { saveProjectToKV } from "../redux/actions/index";
import { loadProjectFromKV } from "../redux/actions/index";

window.store = store;
window.addCurrProject = addCurrProject;
window.setCurrProject = setCurrProject;
window.setCurrPopupID = setCurrPopupID;
window.generateCurrProject = generateCurrProject;
window.deliverGeneratedTar = deliverGeneratedTar;
window.saveProjectToKV = saveProjectToKV;
window.loadProjectFromKV = loadProjectFromKV;

