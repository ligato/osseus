const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const fetch = require('node-fetch');
const Webhooks = require('node-webhooks')

app.use(cors());

io.on('connection', socket => {
    // Saves current project
    socket.on('SEND_SAVE_PROJECT', state => {
        fetch("http://0.0.0.0:9191/v1/projects", {
            method: "POST",
            body: JSON.stringify(state),
        })
    });

    // Loads previous project
    socket.on('SEND_LOAD_PROJECT', state => {
        console.log(state)
        fetch(`http://0.0.0.0:9191/v1/projects/${state}`)
            .then(res => console.log(res.body))
            .then(data => socket.broadcast.emit('SEND_PROJECT_TO_CLIENT', data))
    })

    // Generates new project
    socket.on('GENERATE_PROJECT', state => {
        // Initialize webhook
        const webhooks = new Webhooks({
            db: './webHooksDB.json',
        })

        // Add webhook watcher onto etcd /template keys
        webhooks.add('etcdConn', 'http://0.0.0.0:2379/v3beta/watch')
            .then(res => console.log(res))
            .catch(err => console.log(err))
        webhooks.trigger('etcdConn', "{ 'create_request': { 'key': 'L3ZuZi1hZ2VudC92cHAxL2NvbmZpZy9nZW5lcmF0b3IvdjEvdGVtcGxhdGUv' } }")

        // Send project to API /v1/templates/{id}
        fetch(`http://0.0.0.0:9191/v1/templates/${state.projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
        })
            .catch(err => console.log(err))

        // Log output of webhook trigger
        const emitter = webhooks.getEmitter()
        emitter.on('*.*', (name = 'etcdConn', statusCode, body) => {
            console.log(this.event + ' on trigger webHook' + name + 'with status code', statusCode, 'and body', body)
        })

        // // Set reponse variable
        const generatedTar = 'generatedTar is set in server'
        socket.broadcast.emit('GENERATED_TAR', generatedTar);
    })
})

server.listen(8000, () => console.log('connected to port 8000!'));