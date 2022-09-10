import React from 'react';
import { useTranslation } from 'react-i18next';

import PageNotFoundImage from '../../images/404.svg';

function PageNotFound() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img alt={t('pageNotFound')} className="img-fluid h-25" src={PageNotFoundImage} />
      <h1 className="h4 text-muted">{t('pageNotFound')}</h1>
      <p className="text-muted">
        {t('butYouCan')}
        {' '}
        <a href="/">{t('toMainPage')}</a>
      </p>
    </div>
  );
}

export default PageNotFound;
