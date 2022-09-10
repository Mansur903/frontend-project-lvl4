import React, { useState } from 'react';
import {
  Formik, Form,
} from 'formik';
import {
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import { object, string } from 'yup';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SignupImage from '../../images/avatar.jpg';
import TextField from '../components/TextField.jsx';
import useAuth from '../hooks/auth.jsx';

function SignupPage() {
  const [registered, setStatus] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  const { logIn } = useAuth();

  const userSchema = object({
    username: string().min(3, t('from3To20')).max(20, t('from3To20')).required(t('requiredField')),
    password: string().min(6, t('sixOrMore')).required(t('requiredField')),
    confirmPassword: string().oneOf([Yup.ref('password'), null], t('passwordsMustMatch')),
  });

  const goHome = () => {
    history.push('/');
  };

  const handleSubmit = (values) => (e) => {
    e.preventDefault();
    axios.post('/api/v1/signup', values)
      .then((response) => {
        logIn(response);
        goHome();
      })
      .catch((error) => {
        setStatus(false);
        console.log(error);
      });
  };

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={SignupImage} alt={t('registration')} className="rounded-circle" />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={userSchema}
              >
                {({
                  errors, touched, handleChange, handleBlur, values,
                }) => (
                  <Form className="w-50" onSubmit={handleSubmit(values)}>
                    <h1 className="text-center mb-4">{t('registration')}</h1>
                    <TextField name="username" errors={errors} placeholder={t('username')} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="password" errors={errors} placeholder={t('password')} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
                    <TextField name="confirmPassword" errors={errors} placeholder={t('confirmPassword')} handleChange={handleChange} handleBlur={handleBlur} touched={touched} />
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
  );
}

export default SignupPage;
