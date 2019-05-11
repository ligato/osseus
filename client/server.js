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

io.on('connection', socket => {
    // Saves current project
    socket.on('SEND_SAVE_PROJECT', state => {
        fetch("http://localhost:9191/v1/projects", {
            method: "POST",
            body: JSON.stringify(state),
        })
    });

    // Loads previous project
    socket.on('SEND_LOAD_PROJECT', state => {
        console.log(state)
        fetch(`http://localhost:9191/v1/projects/${state}`)
            .then(res => console.log(res.body))
            .then(data => socket.broadcast.emit('SEND_PROJECT_TO_CLIENT', data))
    })

    //Loads all the existing projects
    socket.on('LOAD_ALL_FROM_KV', state => {
        console.log('load all')
    })

    //Deletes the selected project from the KV store
    socket.on('DELETE_PROJECT_FROM_KV', state => {
        console.log(state)
        fetch(`http://localhost:9191/v1/projects/${state}`, {
            method: "DELETE",
        })
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
        const generate = await fetch(`http://localhost:9191/v1/templates/${state.projectName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state)
        })
        const result = await generate
        console.debug(`Generate Request Status: ${result.status} ${result.statusText}`)

        // Initialize webhook
        const webHooks = new Webhooks({
            db: '../webhookDB.json',
        })

        // Encode key to base64
        const base64Key = Buffer.from(`/vnf-agent/vpp1/config/generator/v1/template/${state.projectName}`).toString('base64')

        // Add webhook to get value from specified project key
        // (TODO) Figure out why /v3beta/watch no longer works
        webHooks.add('etcd', 'http://localhost:2379/v3beta/kv/range')

        // Trigger webhook & send WATCH request
        webHooks.trigger('etcd', { key: base64Key })

        // Shows emitted events
        const emitter = webHooks.getEmitter()
        emitter.once('etcd.success', (name, statusCode, body) => {
            // Create object from string response
            const data = JSON.parse(body)

            // Decode value
            let value = data.kvs[0].value.toString()
            value = Buffer.from(value, 'base64')

            // Decode tar
            let buffer = JSON.parse(value)
            buffer = Buffer.from(buffer.tar_file, 'base64')

            // Displays code to frontend
            fs.writeFile('public/code.txt', buffer.toString(), function (err) {
                if (err) throw err;
            });

            // Deletes out-of-range ascii characters from file
            fs.readFile('public/code.txt', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                // Removal of anything not ascii
                var withoutNull = data.replace(/[\x00]/g, "");
                var withoutMetadata = removeMetadata(withoutNull);

                // Captures results and writes it back to file
                let result = withoutMetadata.join('\n');
                fs.writeFile('public/code.txt', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            // Create tar folder
            fs.writeFile('public/template.tgz', buffer, function (err) {
                if (err) throw err;
            });

            console.log("Tar file generation complete")
        })
    })
})

server.listen(8000, () => console.log('connected to port 8000!'))

// Removes first and last lines of file. These lines contain extra metadata created
// by the generator, for display these tend to confuse the code highlighter
function removeMetadata(file) {
    let fileByLines = file.split('\n');
    fileByLines.splice(-1, 1);
    fileByLines.splice(0, 1);
    fileByLines.unshift(' ', ' ');
    fileByLines.push('}');
    return fileByLines;
}