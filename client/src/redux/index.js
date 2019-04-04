import store from "../redux/store/index";
import { addCurrProject } from "../redux/actions/index";
import { setCurrProject } from "../redux/actions/index";
import { setCurrPopupID } from "../redux/actions/index";

window.store = store;
window.addCurrProject = addCurrProject;
window.setCurrProject = setCurrProject;
window.setCurrPopupID = setCurrPopupID;
