import io from 'socket.io-client'

const serverConn = 'http://192.168.39.143:31101'

const socket = io(`${serverConn}`);

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