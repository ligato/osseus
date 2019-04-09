import store from '../redux/store/index';

//let pluginModule = require('../components/Model');
//var request = require('request');

export function save() {
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

export function loadProject() {
    // Retrieve plugins from api
    fetch(`http://0.0.0.0:8000/v1/projects/${store.getState().currProject.projectName}`, {
        method: "GET",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
    })
        // Decode response
        .then(res => { return res.json() })
        .then(data => console.log(data))
        .catch(err => console.log("Error: ", err));
}

export function loadAllProjects() {
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
        .catch(err => console.log("Error: ", err));
}

export function generate() {
    const currentProject = store.getState().currProject;

    // Send plugins to agent
    console.log("generate --> /template")
    fetch(`http://0.0.0.0:9191/v1/templates/${currentProject.projectName}`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentProject),
    });

    console.log("generate --> webhook watching")
    fetch(`http://0.0.0.0:2379/v3alpha/watch`, {
        method: "POST",
        mode: "no-cors",
        body: "{'create_request': {'key':'Y29uZmlnL2dlbmVyYXRvci92MS90ZW1wbGF0ZS91bnRpdGxlZA=='} }",
        headers: {
            "Content-Type": "text/plain"
        },
    })
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(err => console.log("Error: ", err));
}