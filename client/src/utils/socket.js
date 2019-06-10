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

import io from 'socket.io-client'
import store from '../redux/store/index';

const socket = io('http://localhost:8000');

// SETS SOCKET ACTIONS
const configureSocket = dispatch => {

    // Start the node server on start
    socket.on('connect', () => {
        console.log('connected to server');
    });

    // Returns the project from server to client
    socket.on('SEND_PROJECT_TO_CLIENT', project => {
        store.dispatch({ type: 'RETURN_LOAD_PROJECT', project })
    });

    // Returns the template from server to client
    socket.on('SEND_TEMPLATE_TO_CLIENT', template => {
        store.dispatch({ type: 'RETURN_TEMPLATE', template });
    });

    return socket
}

export default configureSocket;
