import io from 'socket.io-client'
//import store from '../redux/store/index';
//import { returnTemplate } from "../redux/actions/index";

const socket = io('http://localhost:8000');

// Set socket actions
const configureSocket = dispatch => {
    socket.on('connect', () => {
        console.log('connected to server');
    });

    //Sockets will call the specified redux action
    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    });
    socket.on('SEND_TEMPLATE_TO_CLIENT', template => {
        dispatch({ type: 'RETURN_TEMPLATE', template });
    });

    return socket
}

export default configureSocket;
