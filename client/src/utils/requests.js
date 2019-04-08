import store from '../redux/store/index';

function save() {
    const currentProject = JSON.parse(JSON.stringify(store.getState().currProject));

    // Save current project
    fetch(`http://0.0.0.0:8000/v1/projects/`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentProject)
    })
        // Log response
        .then(resp => resp.json())
        .catch(err => console.log("Error: ", err))
}

function loadProject() {
    // Retrieve plugins from api
    fetch(`http://0.0.0.0:8000/v1/projects/?id=${store.getState().currProject.projectName}`, {
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

function loadAllProjects() {
    // Retrieve plugins from api
    fetch(`http://0.0.0.0:8000/v1/projects`, {
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
    // Send plugins to agent
    fetch(`http://0.0.0.0:9191/v1/templates/?id=${store.getState().currProject.projectName}`, {
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

export default { save, loadProject, loadAllProjects, generate }