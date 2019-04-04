import store from '../redux/store/index';
import { addPluginArray, setCurrArray } from "../redux/actions/index";

function save() {
    const plugins = JSON.parse(JSON.stringify(store.getState().savedPlugins));
    store.dispatch(addPluginArray([plugins]));

    const project = store.getState().projects
    console.log(project)
    // Save current project
    fetch(`http://0.0.0.0:8000/v1/api/projects/?id=${project.id}`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    })
        // Log response
        .then(resp => resp.json())
        .catch(err => console.log("Error: ", err))
}

function load(id) {
    // Retrieve plugins from api
    fetch(`http://0.0.0.0:8000/v1/api/projects/?id=${id}`, {
        method: "GET",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
    })
        // Decode response
        .then(res => { return res.json() })
        .then(data => console.log(data))
        .catch(err => console.log("Error: ", err))
}

function generate() {
    // Get current plugins in palette
    const plugins = JSON.parse(JSON.stringify(store.getState().currProject));
    store.dispatch(setCurrArray([plugins]))

    const project = store.getState().projects
    console.log(project)
    // Send plugins to agent
    fetch(`http://0.0.0.0:8000/v1/api/template/?id=${project.id}`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    })
        // Log response
        .then(resp => resp.json())
        .catch(err => console.log("Error: ", err))
}

export default { save, load, generate }