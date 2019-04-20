const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const fetch = require('node-fetch');
const Webhooks = require('node-webhooks');
const protobuf = require('protobufjs');
const Base64 = require('js-base64').Base64;
// const jsonDescriptor = require('./message.json')
// const dotenv = require('dotenv');
// const { Etcd3 } = require('etcd3');
// const client = new Etcd3();
// const Etcd = require('node-etcd');
// const etcd = new Etcd();
// dotenv.config();

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

    // Generates current project
    socket.on('GENERATE_PROJECT', state => {

        /* This is the area we're having trouble in trying to 
         * properly set the webhook to receive the key from 
         * etcd. The webhook seems to have an issue sending 
         * the webhook trigger since the error points to  the string 
         * not being able to be parsed into Go code, "cannot unmarshal 
         * string into Go value of type map[string]json.RawMessage". If 
         * you want to jump into a call today to explain some of the code 
         * to you, let us know and one of us should be free.
         */

        // Initialize webhook
        // https://github.com/roccomuso/node-webhooks#readme
        const webhooks = new Webhooks({
            db: './webHooksDB.json'
        })

        // Encode key
        const key = Base64.btoa("/vnf-agent/vpp1/config/generator/v1/template/untitled")

        // Add webhook watcher onto etcd /template keys
        webhooks.add('etcdConn', 'http://0.0.0.0:2379/v3beta/watch')
            .then(res => console.log("--- triggered webhook ---"))
            .catch(err => console.log(err))

        // Trigger webhook & send watch request
        // https://github.com/etcd-io/etcd/blob/master/Documentation/dev-guide/api_grpc_gateway.md
        webhooks.trigger('etcdConn', `{"create_request":{"key":${key}}}`)

        // Send project to API /v1/templates/{id}
        fetch(`http://0.0.0.0:9191/v1/templates/${state.projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
        })
            .then(console.log("--- Sent new project to generate ---"))
            .catch(err => console.log(err))

        // Log watcher output
        const emitter = webhooks.getEmitter()
        emitter.on('*.success', (name = 'etcdConn', statusCode, body) => {
            console.log('SUCCESS triggering webHook ' + name + ' with status code', statusCode, 'and body', body)
        })

        emitter.on('*.failure', (name = 'etcdConn', statusCode, body) => {
            console.log('FAILED triggering webHook ' + name + ' with status code', statusCode, 'and body', body)
        })

        // ETCD CLIENT v3
        // client.watch()
        //     .key('config/generator/v1/template/untitled')
        //     .create()
        //     .then(watcher => {
        //         watcher
        //             .on('connected', () => console.log('successfully reconnected!'))
        //             .on('disconnected', () => console.log('disconnected...'))
        //             .on('put', res => console.log('foo got set to:', res.value.toString()));
        //     })

        // PROTOBUFJS JSON DESCRIPTOR
        // const root = protobuf.Root.fromJSON(jsonDescriptor)
        // const Message = root.nested;

        // PROTOBUFJS PROTO FILE
        // protobuf.load("message.proto", (err, root) => {
        //     if (err) {
        //         throw err;
        //     }
        // console.log("--- Entered proto load & webhook ---")
        // const Message = root.lookupType("template.Template");
        // console.log("--- set root lookup ---")
        // ...
        // ...
        // DO WEBHOOK STUFF
        // })

        // Set response variable
        const generatedTar = 'generatedTar is set in server'
        socket.broadcast.emit('GENERATED_TAR', generatedTar);
    })

})

server.listen(8000, () => console.log('connected to port 8000!'));