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

const init = (socket) => {
  const store = initStore();
  const { dispatch } = store;

  function ApiProvider({ children }) {
    return (
      <ApiContext.Provider value={socket}>
        {children}
      </ApiContext.Provider>
    );
  }

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

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        ru,
      },
      lng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => {
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
    });

  return (
    <AuthProvider>
      <ApiProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiProvider>
    </AuthProvider>
  );
};

export default init;
