import React from 'react';
import { useHistory } from 'react-router-dom';
import useAuth from './hooks/index.jsx';

function HomePage() {
  const { logIn, logOut } = useAuth();
  const history = useHistory();
  const goLogin = () => {
    history.push('/login');
  };
  React.useEffect(() => {
    if (localStorage.token === undefined) {
      logOut();
      goLogin();
    } else {
      logIn();
    }
  });
  return (
    <div>This is HomePage</div>
  );
}

export default HomePage;
