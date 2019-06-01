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
const cors = require('cors')
const fetch = require('node-fetch');
const Webhooks = require('node-webhooks');
const fs = require('fs')

app.use(cors())

const agent = 'localhost:9191'
const etcd = 'localhost:12379'

io.on('connection', socket => {

    /*
    ================================
    Sockets For Project Management
    ================================
    */

    // SAVES CURRENT PROJECT
    socket.on('SEND_SAVE_PROJECT', project => {
        project.plugins.length = 16;
        const selectedPlugins = [];
        const allPlugins = project.plugins;

        // Filter out selected plugins
        allPlugins.map(plugin => {
            if (plugin.selected) {
                selectedPlugins.push(plugin)
            }
        })

        // Set selected plugins for generation
        project.plugins = selectedPlugins

        console.log(project)
        fetch(`http://${agent}/v1/projects`, {
            method: "POST",
            body: JSON.stringify(project),
        }).then(res => console.log(res.statusCode))
    });

    // LOADS PREVIOUS PROJECT
    socket.on('SEND_LOAD_PROJECT', project => {
        console.log(project)
        fetch(`http://${agent}/v1/projects/${project}`)
            .then(res => console.log(res.body))
            .then(data => socket.broadcast.emit('SEND_PROJECT_TO_CLIENT', data))
    })

    // LOADS ALL EXISTING PROJECTS (not implemented)
    socket.on('LOAD_ALL_FROM_KV', projects => {

    })

    // DELETES SELECTED PROJECT
    socket.on('DELETE_PROJECT_FROM_KV', project => {
        console.log(project)
        fetch(`http://${agent}/v1/projects/${project}`, {
            method: "DELETE",
        })
    })

    /*
    ========================
    Sockets For Generation
    ========================
    */

    // GENERATES CURRENT PROJECT
    socket.on('GENERATE_PROJECT', async project => {

        // Filter anything out more than the 16 default plugins
        project.plugins.length = 16;

        const selectedPlugins = [];
        const selectedCustomPlugins = [];
        const allPlugins = project.plugins;
        const allCustomPlugins = project.customPlugins;

        // Filter out selected plugins
        allPlugins.map(plugin => {
            if (plugin.selected) {
                selectedPlugins.push(plugin)
            }
        })
        // Filter out selected custom plugins
        allCustomPlugins.map(plugin => {
            if (plugin.selected) {
                selectedCustomPlugins.push(plugin)
            }
        })         

        // Set selected plugins for generation
        project.plugins = selectedPlugins;
        project.customPlugins = selectedCustomPlugins;

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
        const base64Key = Buffer.from(`/vnf-agent/vpp1/config/generator/v1/template/structure/${project.projectName}`).toString('base64')

        // Add webhook to get value from specified project key
        // (TODO) Figure out why /v3beta/watch no longer works
        webHooks.add('etcd', `http://${etcd}/v3beta/kv/range`)

        // Trigger webhook & send WATCH request
        webHooks.trigger('etcd', { key: base64Key })

        // Shows emitted events
        const emitter = webHooks.getEmitter()
        emitter.once('etcd.success', (name, statusCode, body) => {

            const data = JSON.parse(body)

            // Decode value
            let value = data.kvs[0].value.toString()
            value = Buffer.from(value, 'base64')

            // Decode tar
            buffer = Buffer.from(value, 'base64').toString();
            
            // Emit the socket to send the buffer back to the client
            socket.emit('SEND_TEMPLATE_TO_CLIENT', buffer);
        })
    })

    // DOWNLOADS TAR FILE
    socket.on('DOWNLOAD_TAR', project => {

        fetch(`http://${agent}/v1/templates`)
            .then(response => { 
                return response.json().catch(err => console.error(err))
            })
            .then(json => {

                // Create object from string response
                const data = JSON.parse(JSON.stringify(json.TarFile))
                
                // Convert from base64
                buffer = Buffer.from(data, 'base64')

                // Create tar folder
                fs.writeFile('public/template/template.tgz', buffer, function (err) {
                    if (err) throw err;
                });

                console.log("Tar file generation complete")
            }).catch(err => console.error(err))
            
    })
})

server.listen(8000, () => console.log(`Server listening on 8000`))
