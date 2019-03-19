import store from "../redux/store/index";
import { addPluginArray } from "../redux/actions/index";
import { saveArray } from "../redux/actions/index";
import { setCurrArray } from "../redux/actions/index";
import { setCurrPopupID } from "../redux/actions/index";

window.store = store;
window.addPluginArray = addPluginArray;
window.saveArray = saveArray;
window.setCurrArray = setCurrArray;
window.setCurrPopupID = setCurrPopupID;
