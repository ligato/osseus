import io from 'socket.io-client'

const serverConn = '192.168.99.100/server'

const socket = io(`http://${serverConn}`);

// Set socket actions
const configureSocket = dispatch => {
    socket.on('connect', () => {
        console.log('connected to server');
    });

    //Sockets will call the specified redux action
    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    });
    socket.on('GENERATED_TAR', state => {
        dispatch({ type: 'DELIVER_GENERATED_TAR', state })
    });

    return socket
}

export default configureSocket;
