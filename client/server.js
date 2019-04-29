// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const fetch = require('node-fetch');
const Webhooks = require('node-webhooks');

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
    socket.on('GENERATE_PROJECT', async state => {
        // Send project to API /v1/templates/{id}
        let generate = await fetch(`http://0.0.0.0:9191/v1/templates/${state.projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
        })
        let result = await generate
        console.debug(`Generate Request Status: ${result.status} ${result.statusText}`)

        // Initialize webhook
        const webhooks = new Webhooks({
            db: './webHooksDB.json',
            httpSuccessCodes: [200, 201, 202, 203, 204],
        })

        // Encode key
        const base64Key = Buffer.from(`/vnf-agent/vpp1/config/generator/v1/template/${state.projectName}`).toString('base64')

        // Add webhook watcher onto etcd /template keys
        webhooks.add('etcdConn', 'http://localhost:2379/v3beta/watch')
            .then(console.debug("Init Webhook"))
            .catch(err => console.error(err))

        // Trigger webhook & send watch request
        webhooks.trigger('etcdConn', { key: base64Key })

        // Shows emitted events
        const emitter = webhooks.getEmitter()
        emitter.on('*.success', (name = 'etcdConn', statusCode, response) => {
            // Create object from string response
            const body = JSON.parse(response)

            // Decode value
            let value = body.kvs[0].value.toString()
            value = Buffer.from(value, 'base64')

            console.debug(`SUCCESS: ${name} ${statusCode} ${value}`)
        })

        emitter.on('*.failure', (name = 'etcdConn', statusCode, body) => {
            console.error('FAILED triggering webHook ' + name + ' with status code', statusCode, 'and body', body)
        })

        // Set response variable
        const generatedTar = 'generatedTar is set in server'
        socket.broadcast.emit('GENERATED_TAR', generatedTar);
    })

})

server.listen(8000, () => console.log('connected to port 8000!'));