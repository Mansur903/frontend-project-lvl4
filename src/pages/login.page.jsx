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

import LoginImage from '../../images/hexlet-image.jpg';
import routes from '../routes';
import TextField from '../components/TextField.jsx';
import useAuth from '../hooks/auth.jsx';
import showToast from '../utilities.js';

function LoginPage() {
  const history = useHistory();
  const { logIn, loggedIn, logOut } = useAuth();

  const goHome = () => {
    history.push(routes.homePath);
  };

  const { t } = useTranslation();

  const userSchema = object({
    username: string().min(3, t('mustBeThreeOrMore')).required(t('requiredField')),
    password: string().min(4, t('mustBeFourOrMore')).required(t('requiredField')),
  });

  const errorClassNames = cn({
    'error-field': !loggedIn,
    'no-error-field': loggedIn === null,
  });

  const showErrorToast = (e) => {
    console.log(e);
    if (e.response.status === 401) {
      showToast('error', t('authorizeError'));
      return;
    }
    if (e.response.message === 'Network Error') {
      showToast('error', t('downloadingError'));
      return;
    }
    showToast('error', t('unknownError'));
  };

  const handleSubmit = (values) => (e) => {
    e.preventDefault();
    axios.post(routes.httpLoginPath(), values)
      .then((response) => {
        logIn(response);
        goHome();
      })
      .catch((error) => {
        logOut(false);
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
              >
                {({
                  errors, touched, handleChange, handleBlur, values, isValid,
                }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={handleSubmit(values)}>
                    <h1 className="text-center mb-4">{t('signin')}</h1>
                    <TextField name="username" placeholder={t('nickname')} errors={errors} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="password" placeholder={t('password')} errors={errors} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <Button className="w-100 mb-3 btn btn-outline-primary" variant="null" type="submit" disabled={!isValid}>{t('signin')}</Button>
                    <div className={errorClassNames}>{t('wrongLoginPassword')}</div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('noAccount')}
                  {' '}
                </span>
                <a href={routes.signupPath}>{t('registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
