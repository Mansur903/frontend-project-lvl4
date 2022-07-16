import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  initChannels, initMessages, chooseChannel, newMessage, openModal,
  newChannel,
} from './slices/chatSlice.js';
import Login from './login.page.jsx';
import Home from './home.page.jsx';
import AuthContext from './contexts/index.jsx';

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

function App() {
  const dispatch = useDispatch();

  const chatState = useSelector((state) => state.chat);
  const socket = io().connect();

  console.log('app started');
  return (
    <AuthProvider>
      <Router>
        {/*           <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav> */}

        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/">
            <Home socket={socket} />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
