import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import './assets/application.scss';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import init from './init.jsx';

const app = async () => {
  const socket = io().connect();
  const vdom = await init(socket);
  ReactDOM.render(
    vdom,
    document.querySelector('#chat'),
  );
};

app();
