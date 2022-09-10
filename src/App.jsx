import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import routes from './routes.js';

import Login from './pages/login.page.jsx';
import Home from './pages/home.page.jsx';
import Signup from './pages/signup.page.jsx';
import PageNotFound from './pages/404.page.jsx';
import Header from './Header.jsx';

function PrivateRoute({ children }) {
  const isAuthentificated = () => {
    if (localStorage.token === undefined) return false;
    return true;
  };

  return (
    <Route
      render={() => (isAuthentificated() ? (
        children
      ) : (
        <Redirect to={{
          pathname: routes.loginPath,
        }}
        />
      ))}
    />
  );
}

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <Router>
          <div className="d-flex flex-column h-100">
            <Header />
            <Switch>
              <Route path={routes.loginPath}>
                <Login />
              </Route>

              <Route path={routes.signupPath}>
                <Signup />
              </Route>

              <Route exact path={routes.homePath}>
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              </Route>

              <Route path={routes.otherPath}>
                <PageNotFound />
              </Route>
            </Switch>
          </div>
        </Router>
        <ToastContainer />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
