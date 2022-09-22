import React from 'react';
import { useTranslation } from 'react-i18next';

import PageNotFoundImage from '../../images/404.svg';

function PageNotFound() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img alt={t('info.pageNotFound')} className="img-fluid h-25" src={PageNotFoundImage} />
      <h1 className="h4 text-muted">{t('info.pageNotFound')}</h1>
      <p className="text-muted">
        {t('info.butYouCan')}
        {' '}
        <a href="/">{t('info.toMainPage')}</a>
      </p>
    </div>
  );
}

export default PageNotFound;
