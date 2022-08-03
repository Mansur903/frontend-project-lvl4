import React, { useState } from 'react';
import {
  Formik, Field, Form,
} from 'formik';
import {
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import { object, string } from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { authSuccess, setUser } from '../slices/chatSlice.js';
import SignupImage from '../../images/avatar.jpg';
import Header from '../Header.jsx';

const userSchema = object({
  username: string().min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов').required('Это обязательное поле'),
  password: string().min(6, 'Не менее 6 символов').required('Это обязательное поле'),
  confirmPassword: string().oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
});

function SignupPage() {
  const [registered, setStatus] = useState(null);
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  console.log('chatState :', chatState);
  const history = useHistory();

  const goHome = () => {
    history.push('/');
  };

  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={SignupImage} alt="Регистрация" className="rounded-circle" />
                </div>
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={userSchema}
                  onSubmit={(values) => {
                    axios.post('/api/v1/signup', values)
                      .then((response) => {
                        dispatch(setUser(response.data.username));
                        dispatch(authSuccess());
                        localStorage.token = response.data.token;
                        localStorage.username = response.data.username;
                        goHome();
                      })
                      .catch((error) => {
                        setStatus(false);
                        console.log(error);
                      });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="w-50">
                      <h1 className="text-center mb-4">{t('registration')}</h1>
                      <div className="form-floating mb-3">
                        <Field className="form-control" name="username" id="username" required />
                        <label className="form-label" htmlFor="username">{t('username')}</label>
                        {errors.username && touched.username ? (<div className="error-field">{errors.username}</div>) : null}
                      </div>
                      <div className="form-floating mb-3">
                        <Field className="form-control" type="password" name="password" id="password" required />
                        <label className="form-label" htmlFor="password">{t('password')}</label>
                        {errors.password && touched.password ? (<div className="error-field">{errors.password}</div>) : null}
                      </div>
                      <div className="form-floating mb-3">
                        <Field name="confirmPassword" required autoComplete="new-password" type="password" id="confirmPassword" className="form-control" />
                        <label className="form-label" htmlFor="confirmPassword">{t('confirmPassword')}</label>
                        {errors.confirmPassword && touched.confirmPassword ? (<div className="error-field">{errors.confirmPassword}</div>) : null}
                      </div>
                      <Button type="submit" className="w-100 btn btn-outline-primary" variant="null">{t('signup')}</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="error-field row justify-content-center align-content-center m-10">{registered === null ? null : t('userExists')}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
