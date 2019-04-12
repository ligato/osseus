const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const fetch = require('node-fetch');

app.use(cors());

io.on('connection', socket => {
    socket.on('SEND_SAVE_PROJECT', state => {
        fetch("http://0.0.0.0:9191/v1/projects", {
            method: "POST",
            body: JSON.stringify(state),
        })
    });

    socket.on('SEND_LOAD_PROJECT', state => {
        console.log(state)
        fetch(`http://0.0.0.0:9191/v1/projects/${state}`)
            .then(res => console.log(res.body))
            // .then(data => console.log(data))
            .then(data => socket.broadcast.emit('SEND_PROJECT_TO_CLIENT', data))
    })
})

server.listen(8000, () => console.log('connected to port 8000!'));