import io from 'socket.io-client'

const socket = io('http://localhost:8000');

const configureSocket = dispatch => {
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    })

    return socket
}

export default configureSocket;