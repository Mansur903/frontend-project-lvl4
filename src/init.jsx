import React from 'react';
import i18n from 'i18next';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider } from 'react-redux';
import { initReactI18next } from 'react-i18next';

import App from './App.jsx';
import { channelsActions } from './slices/channelsInfo.js';
import { messagesActions } from './slices/messagesInfo.js';
import ru from './locales/ru';
import { initStore } from './slices/store';
import ApiContext from './contexts/api.jsx';
import AuthContext from './contexts/auth.jsx';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(null);
  const logOut = (param) => {
    localStorage.removeItem('token');
    setLoggedIn(param);
  };
  const logIn = (response) => {
    localStorage.token = response.data.token;
    localStorage.username = response.data.username;
    setLoggedIn(true);
  };

  const getAuthHeader = () => {
    if (localStorage.token) return { Authorization: `Bearer ${localStorage.token}` };
    return {};
  };

  const providerValues = React.useMemo(() => ({
    logOut, logIn, loggedIn, setLoggedIn, getAuthHeader,
  }), [logOut, logIn, loggedIn, setLoggedIn, getAuthHeader]);

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
}

const api = (socket) => ({
  newMessage: (message) => socket.emit('newMessage', message),
  newChannel: (channel) => socket.emit('newChannel', channel),
  removeChannel: (id) => socket.emit('removeChannel', { id }),
  renameChannel: (data) => socket.emit('renameChannel', data),
});

const init = async (socket) => {
  const store = initStore();
  const { dispatch } = store;

  injectStyle();
  socket.on('newMessage', (receivedMessage) => {
    dispatch(messagesActions.newMessage(receivedMessage));
  });
  socket.on('newChannel', (receivedChannel) => {
    dispatch(channelsActions.newChannel(receivedChannel));
    dispatch(channelsActions.setActiveChannel(receivedChannel.id));
  });
  socket.on('removeChannel', (data) => {
    const { id } = data;
    dispatch(channelsActions.removeChannel(id));
  });
  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.renameChannel(channel));
  });

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
    <AuthProvider>
      <ApiContext.Provider value={api(socket)}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiContext.Provider>
    </AuthProvider>
  );
};

export default init;
