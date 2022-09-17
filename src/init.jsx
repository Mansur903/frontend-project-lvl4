import React from 'react';
import i18n from 'i18next';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { initReactI18next } from 'react-i18next';

import App from './App.jsx';
import { channelsActions } from './slices/channelsInfo.js';
import { messagesActions } from './slices/messagesInfo.js';
import ru from './locales/ru';
import { initStore } from './slices/store';
import ApiContext from './contexts/api.jsx';
import AuthContext from './contexts/auth.jsx';

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(localStorage.user ? JSON.parse(localStorage.user).username : undefined);

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

const getApi = (socket) => ({
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
