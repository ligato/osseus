const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');

app.use(cors());
server.listen(8000, () => console.log('connected to port 8000!'));

io.on('connection', function (socket) {
    console.log('an user connected');
});