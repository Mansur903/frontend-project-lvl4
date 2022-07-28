import React from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
} from 'react-bootstrap';

import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authSuccess, authError, setAuthNull } from '../slices/chatSlice.js';
import LoginImage from '../../images/hexlet-image.jpg';
import useAuth from '../hooks/index.jsx';
// Хуки находятся в react-redux

const userSchema = object({
  username: string().min(3, 'Должно быть 3 или более символов').required('Это обязательное поле'),
  password: string().min(4, 'Должно быть 4 или более символов').required('Это обязательное поле'),
});

function LoginForm() {
  const { logOut } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);

  const goHome = () => {
    history.push('/');
  };

  const { t } = useTranslation();

  const handleLogOut = () => {
    logOut();
    dispatch(authError());
    setAuthNull();
  };

  const errorField = cn({
    'error-field': !chatState.authorized,
    'no-error-field': chatState.authorized === null,
  });

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">{t('chatTitle')}</a>
          {chatState.authorized ? <button type="button" onClick={handleLogOut} className="btn btn-primary">{t('logout')}</button> : null}
        </div>
      </nav>
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
                  validationSchema={userSchema}
                  onSubmit={(values) => {
                    axios.post('/api/v1/login', values)
                      .then((response) => {
                        dispatch(authSuccess());
                        localStorage.token = response.data.token;
                        goHome();
                      })
                      .catch((error) => {
                        dispatch(authError());
                        console.log(error);
                      });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">{t('signin')}</h1>
                      <div className="form-floating mb-3">
                        <Field className="form-control" name="username" id="username" placeholder={t('nickname')} required />
                        <label htmlFor="username">{t('nickname')}</label>
                        {errors.username && touched.username ? (<div className="error-field">{errors.username}</div>) : null}
                      </div>
                      <div className="form-floating mb-4">
                        <Field className="form-control" name="password" id="password" placeholder={t('password')} type="password" />
                        <label htmlFor="password">{t('password')}</label>
                        {errors.password && touched.password ? (<div className="error-field">{errors.password}</div>) : null}
                      </div>
                      <Button className="w-100 mb-3 btn btn-outline-primary" variant="null" type="submit">{t('signin')}</Button>
                      <div className={errorField}>{t('wrongLoginPassword')}</div>
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
                  <a href="/signup">{t('registration')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <>
      {LoginForm()}
    </>
  );
}

export default LoginPage;
