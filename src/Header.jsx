import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useAuth from './hooks/index.jsx';
import {
  setAuthNull,
  authError,
} from './slices/chatSlice';

function Header() {
  const { logOut } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogOut = () => {
    logOut();
    dispatch(authError());
    dispatch(setAuthNull());
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('chatTitle')}</a>
        {localStorage.token !== undefined ? <Link to="/login"><button type="button" onClick={handleLogOut} className="btn btn-primary">{t('logOut')}</button></Link> : null}
      </div>
    </nav>
  );
}

export default Header;
