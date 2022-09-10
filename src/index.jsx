import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import init from './init.jsx';

const socket = io().connect();

ReactDOM.render(
  init(socket),
  document.querySelector('#chat'),
);
