import React from 'react';
import {
  Formik, Form,
} from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import cn from 'classnames';
import {
  Button,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StatusCodes } from 'http-status-codes';

import LoginImage from '../../images/hexlet-image.jpg';
import routes from '../routes';
import FormTextField from '../components/FormTextField.jsx';
import useAuth from '../hooks/auth.jsx';
import showToast from '../utilities.js';

function LoginPage() {
  const [authError, setAuthError] = React.useState(false);
  const history = useHistory();
  const { logIn } = useAuth();

  const goHome = () => {
    history.push(routes.homePath);
  };

  const { t } = useTranslation();

  const userSchema = object({
    username: string().required(),
    password: string().required(),
  });

  const errorClassNames = cn({
    'error-field': authError === true,
    'no-error-field': authError === false,
  });

  const showErrorToast = (e) => {
    if (e.response.status === StatusCodes.UNAUTHORIZED) {
      return;
    }
    if (e.response.message === 'Network Error') {
      showToast('error', t('toasts.downloadingError'));
      return;
    }
    showToast('error', t('toasts.unknownError'));
  };

  const handleSubmit = (values) => {
    axios.post(routes.httpLoginPath(), values)
      .then((response) => {
        const { token, username } = response.data;
        logIn({ token, username });
        goHome();
      })
      .catch((error) => {
        setAuthError(true);
        showErrorToast(error);
      });
  };

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={LoginImage} alt="Войти" className="rounded-circle" />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                validateOnMount
                validationSchema={userSchema}
                onSubmit={handleSubmit}
              >
                {({
                  isValid, isSubmitting,
                }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                    <h1 className="text-center mb-4">{t('interfaces.signin')}</h1>
                    <FormTextField name="username" type="text" placeholder={t('info.nickname')} />
                    <FormTextField name="password" type="password" placeholder={t('inputs.password')} />
                    <Button className="w-100 mb-3 btn btn-outline-primary" variant="null" type="submit" disabled={!isValid && !isSubmitting}>{t('interfaces.signin')}</Button>
                    <div className={errorClassNames}>{t('validation.wrongLoginPassword')}</div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('info.noAccount')}
                  {' '}
                </span>
                <a href={routes.signupPath}>{t('interfaces.registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
