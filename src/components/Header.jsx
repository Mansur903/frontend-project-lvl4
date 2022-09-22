import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/auth.jsx';

function Header() {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();

  const handleLogOut = () => {
    logOut();
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('chat.header')}</a>
        {!!user === true ? <Link to="/login"><button type="button" onClick={handleLogOut} className="btn btn-primary">{t('interfaces.logOut')}</button></Link> : null}
      </div>
    </nav>
  );
}

export default Header;
