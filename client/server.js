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
const fs = require('fs')

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
        const selected = []
        const allPlugins = state.plugins

        // Filter out selected plugins
        allPlugins.map(plugin => {
            if (plugin.selected) {
                selected.push(plugin)
            }
        })

        // Set selected plugins for generation
        state.plugins = selected

        // Send project to API /v1/templates/{id}
        const generate = await fetch(`http://0.0.0.0:9191/v1/templates/testkey`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
        })
        const result = await generate
        console.debug(`Generate Request Status: ${result.status} ${result.statusText}`)

        // Webhook listener
        // const etcdPut = 'etcdPut'
        const etcdWatch = 'etcdWatch'

        // Initialize webhook
        const webHooks = new Webhooks({
            db: './webHooksDB.json',
        })

        // Encode key
        const base64Key = Buffer.from(`/vnf-agent/vpp1/config/generator/v1/template/testkey`).toString('base64')

        // Add webhook watcher onto etcd /template keys
        // webHooks.add(etcdPut, 'http://localhost:2379/v3beta/kv/put')
        //     .then(console.log("Put Webhook Set"))
        //     .catch(e => console.debug(e))

        webHooks.add(etcdWatch, 'http://localhost:2379/v3beta/watch')
            .then(console.log("Watch Webhook Set"))
            .catch(e => console.debug(e))

        // Trigger webhook & send watch request
        // webHooks.trigger(etcdPut, { key: base64Key, value: 'dGVtcA==' })
        webHooks.trigger(etcdWatch, { key: base64Key })

        // Shows emitted events
        const emitter = webHooks.getEmitter()
        emitter.once('etcdWatch.failure', (name, statusCode, body) => {
            console.log('FAILURE triggering webHook ' + name + ' with status code', statusCode, 'and body', body)
        })

        emitter.once('etcdWatch.success', (name, statusCode, response) => {
            console.log('SUCCESS triggering webHook ' + name + ' with status code', statusCode, 'and body', response)

            // Create object from string response
            const body = JSON.parse(response)
            console.log(body)

            // // Decode value
            // let value = body.kvs[0].value.toString()
            // value = Buffer.from(value, 'base64')

            // // Decode tar
            // let buffer = JSON.parse(value)
            // buffer = Buffer.from(buffer.tar_file, 'base64')

            // // Displays code to frontend
            // fs.appendFile('public/code.txt', buffer, function (err) {
            //     if (err) throw err;
            //     console.log('Saved!');
            // });

            // // Create tar folder
            // fs.appendFile('public/template.tgz', buffer, function (err) {
            //     console.log('Saved!');
            // });

        })
    })
})

server.listen(8000, () => console.log('connected to port 8000!'))