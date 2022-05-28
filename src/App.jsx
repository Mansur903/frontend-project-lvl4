import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

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

  console.log('loggedIn :', loggedIn);
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/login">
              <Login />
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
