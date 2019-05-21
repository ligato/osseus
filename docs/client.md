---
title: "Understanding key parts of the Client"
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

There are many key files that play a major role within client, but for now we'll look at _four_ select files to go over and understand what they do. 

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

4. `/client/src/index.js`, is our inital entry point of our application. It configures our socket client and calls our application (including all the folders in /src) to be rendered to the user by `/client/public/index.html` on port 3000:
```javascript
...
// Setup redux store
const store = createStore(reducer);

// Setup socket client connection
export const socket = configureSocket(store.dispatch);

// Render application to id=root
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
...
```