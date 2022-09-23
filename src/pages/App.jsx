import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import routes from '../routes.js';

import Login from './login.page.jsx';
import Home from './home.page.jsx';
import Signup from './signup.page.jsx';
import PageNotFound from './404.page.jsx';
import Header from '../components/Header.jsx';
import useAuth from '../hooks/auth.jsx';

function PrivateRoute({ component: Component, path }) {
  const { user } = useAuth();
  console.log('userr :', user);

  return (
    <Route
      path={path}
      render={() => (user ? (
        <Component />
      ) : (
        <Redirect to={{
          pathname: routes.loginPath,
        }}
        />
      ))}
    />
  );
}

function App() {
  return (
    <>
      <Router>
        <div className="d-flex flex-column h-100">
          <Header />
          <Switch>
            <Route path={routes.loginPath} exact component={Login} />

            <Route path={routes.signupPath} exact component={Signup} />

            <PrivateRoute path={routes.homePath} exact component={Home} />

            <Route path={routes.otherPath} component={PageNotFound} />
          </Switch>
        </div>
      </Router>
      <ToastContainer />
    </>

  );
}

export default App;
