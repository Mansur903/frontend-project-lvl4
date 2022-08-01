import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// какая-то проблема с css-loader, приходится использовать строчку ниже
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider, ErrorBoundary } from '@rollbar/react';

import {
  newMessage,
  newChannel,
  removeChannel,
  renameChannel,
} from './slices/chatSlice';
import ru from './locales/ru';
import Login from './pages/login.page.jsx';
import Home from './pages/home.page.jsx';
import Signup from './pages/signup.page.jsx';
import AuthContext from './contexts/index.jsx';

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
  });

injectStyle();

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const rollbarConfig = {
  accessToken: '979dfcda02894ef0a50090c43a45b499',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'development',
  },
};

function App() {
  const dispatch = useDispatch();
  const socket = io().connect();

  React.useEffect(() => {
    console.log('socket :', socket);
    socket.on('newMessage', (receivedMessage) => {
      dispatch(newMessage(receivedMessage));
    });
    socket.on('newChannel', (receivedChannel) => {
      dispatch(newChannel(receivedChannel));
    });
    socket.on('removeChannel', (data) => {
      const { id } = data;
      dispatch(removeChannel(id));
    });
    socket.on('renameChannel', (channel) => {
      console.log('channel :', channel);
      dispatch(renameChannel(channel));
    });
  }, []);

  console.log('app started');
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>

              <Route path="/signup">
                <Signup />
              </Route>

              <Route path="/">
                <Home socket={socket} />
              </Route>
            </Switch>
          </Router>
        </AuthProvider>
        <ToastContainer />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
