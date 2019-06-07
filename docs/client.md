---
title: "Understanding key parts of the Client"
last updated: "June 2019"
---

# :zap: Getting started: Client

## Resources

If you're not familiar with what React is or how to get started with it, refer to their docs [here](https://reactjs.org/docs/getting-started.html). Also, if you're unfamiliar with Node or Socket.io, check out their docs [here](https://nodejs.org/en/docs/) and [here](https://socket.io/) to get started.

## Key Packages in Client

- **React** helps with component-based rendering & hot-reloading to quickly test our application.
- **Redux** holds our client-side state, helping manage things such as what plugins were chosen, saving to local storage, and options that are set.
- **NodeJS** handles the network communication from our UI to our sockets, as well as the connection from the client to agent.
- **SocketIO** facilitates bi-directional event-based communication between layers of our application.
- **Node-Webhooks** allows for a connection on our server to wait for a change in our data store for a specific key, then returns that information to the server.

## Key Files in Client

There are many files that play a big role within client, first we'll look at a few files relevant to node.js, which handle the core processes and connections.

1. `/client/package.json` is where we list all our dependencies for both our server and client side code, but also where we specify our proxy between the two, using:
```javascript 
...
"proxy": "http://localhost:8000"
...
```
2. `/client/server.js` is our entrypoint to our server which utilizies **Express** and **SocketIO** to establish a connection with the UI & make fetch requests to our Agent REST API. Once a message is sent to our socket that specifies the user selected to _generate_ a project, we opted to use a [node-webhook](https://github.com/roccomuso/node-webhooks) library to retrieve the generated code straight from Etcd:
```javascript
...
// Generates current project
socket.on('GENERATE_PROJECT', async project => {
   const selected = []
   const allPlugins = project.plugins

   // Filter out selected plugins
   allPlugins.map(plugin => {
      if (plugin.selected) {
          selected.push(plugin)
      }
   })

   // Set selected plugins for generation
   project.plugins = selected

   // Send project to API /v1/templates/{id}
   const generate = await fetch(`http://${agent}/v1/templates/${project.projectName}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
   })
   const result = await generate
   console.debug(`Generate Request Status: ${result.status} ${result.statusText}`)

   // Initialize webhook
   const webHooks = new Webhooks({
      db: '../webhookDB.json',
   })

   // Encode key to base64
   const base64Key = Buffer.from(`/vnf-agent/vpp1/config/generator/v1/template/${project.projectName}`).toString('base64')

   // Add webhook to get value from specified project key
   // (TODO) Figure out why /v3beta/watch no longer works
   webHooks.add('etcd', `http://${etcd}/v3beta/kv/range`)

   // Trigger webhook & send WATCH request
   webHooks.trigger('etcd', { key: base64Key })
   ...
```
3. `/client/src/redux` holds our redux store which is used to hold all our projects state & save to local storage. Primarily, redux is also used to send socket calls with the given user payload (project state), as seen in `/client/src/redux/reducers/index.js`:
```javascript
...
//Emits the server to call GENERATE_PROJECT
if (action.type === GENERATE_CURR_PROJECT) {
 socket && socket.emit('GENERATE_PROJECT', action.payload);
}
//Emits the server to call DELETE_PROJECT_FROM_KV
else if (action.type === DELETE_PROJECT) {
 socket && socket.emit('DELETE_PROJECT_FROM_KV', action.payload)
}
//Emits the server to call LOAD_ALL_FROM_KV
else if (action.type === LOAD_ALL_PROJECTS) {
 socket && socket.emit('LOAD_ALL_FROM_KV', action.payload)
}
...
```
4. `/client/src/utils/socket.js`, handles our connection back from the node.js server to get data from our backend to our client. This includes the ability to return the template and a loaded project:
```javascript
...
// SETS SOCKET ACTIONS
const configureSocket = dispatch => {

    // Start the node server on start
    socket.on('connect', () => {
        console.log('connected to server');
    });

    // Returns the project from server to client
    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        store.dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    });

    // Returns the template from server to client
    socket.on('SEND_TEMPLATE_TO_CLIENT', template => {
        store.dispatch({ type: 'RETURN_TEMPLATE', template });
    });

    return socket
}
...
```
Now we'll go on to go over the two most important react.js files which define the logic and behavior of the two pages of the UI: the Plugin App and the Generator App.

1. `/client/src/component/PluginApp/PluginApp.js`, defines the behavior of which plugins are picked and which view the selected plugins are rendered in:
```javascript
...
  // Receives information on which plugin was picked and alters the state to 
  // reflect this change, rerendering as a result as well.
  pluginSelectionHandler = (index) => {
    let tempArray = this.state.pluginPickedArray;
    tempArray[index] = !tempArray[index] * 1;
    this.setState({
      pluginPickedArray: tempArray
    });
    pluginModule.project.plugins[index].selected = !pluginModule.project.plugins[index].selected;
    // If the plugin is picked then render a deselect button 'x' next to its icon
    if (this.state.pluginPickedArray[index] === 0) {
      deselectButtonVisibility[index] = 'hidden';
    } else {
      deselectButtonVisibility[index] = 'visible';
    }
    store.dispatch(setCurrProject(pluginModule.project));
  }
...
```
2. `/client/src/GeneratorApp/GeneratorApp.js`, passes down template data (CodeStructure.js), project data (GeneratorAppHeader.js) and the code to be shown (CodeViewer.js) to its child components.
```javascript
...
    return (
      <div>
        {/* Renders the regular view of the file and code structure */}
        <GeneratorAppHeader
          newProjectNameHandlerFromGeneratorApp={this.newProjectNameHandler}
          currentProjectNameFromGeneratorApp={this.state.currentProjectName}
          downloadableFromGeneratorApp={this.state.downloadable}
        />
        <CodeStructure
          onNodeSelectHandlerFromGeneratorApp={this.onNodeSelectHandler}
          templateFromGeneratorApp={this.state.template}
        />
        <CodeViewer
          generatedCodeFromGeneratorApp={this.state.selectedFile}
          shownToolTextFromGeneratorApp={this.state.showToolText}
        />
      </div>
    )
...
```
