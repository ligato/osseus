import io from 'socket.io-client'

const socket = io('http://localhost:8000');

// Set socket actions
const configureSocket = dispatch => {
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    });
    socket.on('GENERATED_TAR', state => {
        console.log('state is :' + state)
        dispatch({ type: 'DELIVER_GENERATED_TAR', state })
    });

    return socket
}

export default configureSocket;