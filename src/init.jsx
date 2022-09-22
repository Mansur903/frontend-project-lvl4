import React from 'react';
import i18n from 'i18next';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { initReactI18next } from 'react-i18next';

import App from './pages/App.jsx';
import { channelsActions } from './slices/channelsInfo.js';
import { actions } from './slices/messagesInfo.js';
import ru from './locales/ru';
import initStore from './slices/store';
import ApiContext from './contexts/api.jsx';
import AuthContext from './contexts/auth.jsx';

function AuthProvider({ children }) {
  const userData = localStorage.user;
  const parsedUserData = userData !== undefined ? JSON.parse(userData).username : undefined;
  const [user, setUser] = React.useState(parsedUserData);

  const logOut = (param) => {
    localStorage.removeItem('user');
    setUser(param);
  };

  const logIn = ({ token, username }) => {
    localStorage.setItem('user', JSON.stringify({ username, token }));
    setUser(username);
  };

  const getAuthHeader = () => {
    const { token } = JSON.parse(localStorage.user);
    if (token) return { Authorization: `Bearer ${token}` };
    return {};
  };

  const providerValues = React.useMemo(() => ({
    logOut, logIn, getAuthHeader, user,
  }), [logOut, logIn, getAuthHeader, user]);

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
}

const getSocketCallback = (response, resolve, reject) => {
  if (response.status === 'ok') {
    resolve(response);
  } else {
    reject(new Error('Ошибка в передаче данных'));
  }
};

const getApi = (socket) => ({
  newMessage: (message) => new Promise((resolve, reject) => {
    socket.emit('newMessage', message, (response) => getSocketCallback(response, resolve, reject));
  }),
  newChannel: (channel) => new Promise((resolve, reject) => {
    socket.emit('newChannel', channel, (response) => getSocketCallback(response, resolve, reject));
  }),
  removeChannel: (id) => new Promise((resolve, reject) => {
    socket.emit('removeChannel', { id }, (response) => getSocketCallback(response, resolve, reject));
  }),
  renameChannel: (data) => new Promise((resolve, reject) => {
    socket.emit('renameChannel', data, (response) => getSocketCallback(response, resolve, reject));
  }),
});

const init = async (socket) => {
  const store = initStore();
  const { dispatch } = store;

  injectStyle();
  socket.on('newMessage', (receivedMessage) => {
    dispatch(actions.newMessage(receivedMessage));
  });
  socket.on('newChannel', (receivedChannel) => {
    dispatch(channelsActions.newChannel(receivedChannel));
  });
  socket.on('removeChannel', (data) => {
    const { id } = data;
    dispatch(channelsActions.removeChannel(id));
  });
  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.renameChannel(channel));
  });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        ru,
      },
      lng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <ApiContext.Provider value={getApi(socket)}>
            <Provider store={store}>
              <App />
            </Provider>
          </ApiContext.Provider>
        </AuthProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
