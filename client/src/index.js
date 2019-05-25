import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App';
import * as serviceWorker from './serviceWorker';
import reducer from './redux/reducers/index';
import configureSocket from './utils/socket'

import './index.css';

const store = createStore(reducer);

export const socket = configureSocket(store.dispatch);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();
