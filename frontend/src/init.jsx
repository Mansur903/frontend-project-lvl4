import React from 'react';
import i18n from 'i18next';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider } from 'react-redux';
import { initReactI18next } from 'react-i18next';
import * as yup from 'yup';

import App from './pages/App.jsx';
import { channelsActions } from './slices/channelsInfo';
import { actions } from './slices/messagesInfo';
import ru from './locales/ru';
import initStore from './slices/store';
import ApiContext from './contexts/api.jsx';
import AuthContext from './contexts/auth.jsx';
import yupLocale from './locales/yupLocale';

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

const sendSocketAsync = (actionName, item, socket) => (
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject(), 3000);
    socket.emit(actionName, item, (response) => {
      if (response.status === 'pending') return;
      clearTimeout(timeoutId);
      if (response.status === 'ok') {
        resolve(response);
      } else {
        reject();
      }
    });
  })
);

const getApi = (socket) => ({
  newMessage: (message) => sendSocketAsync('newMessage', message, socket),
  newChannel: (channel) => sendSocketAsync('newChannel', channel, socket),
  removeChannel: (id) => sendSocketAsync('removeChannel', { id }, socket),
  renameChannel: (data) => sendSocketAsync('renameChannel', data, socket),
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

  await yup.setLocale(yupLocale);

  return (
    <AuthProvider>
      <ApiContext.Provider value={getApi(socket)}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiContext.Provider>
    </AuthProvider>
  );
};

export default init;
