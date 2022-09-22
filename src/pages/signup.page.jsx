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
import FormTextField from '../components/FormTextField.jsx';
import useAuth from '../hooks/auth.jsx';

function SignupPage() {
  const [registered, setStatus] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  const { logIn } = useAuth();

  const userSchema = object({
    username: string().min(3, t('validation.from3To20')).max(20, t('validation.from3To20')).required(t('validation.requiredField')),
    password: string().min(6, t('validation.sixOrMore')).required(t('validation.requiredField')),
    confirmPassword: string().oneOf([Yup.ref('password'), null], t('validation.passwordsMustMatch')),
  });

  const goHome = () => {
    history.push('/');
  };

  const handleSubmit = (values) => {
    axios.post('/api/v1/signup', values)
      .then((response) => {
        const { token, username } = response.data;
        logIn({ token, username });
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
                <img src={SignupImage} alt={t('interfaces.registration')} className="rounded-circle" />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={userSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">{t('interfaces.registration')}</h1>
                    <FormTextField name="username" type="text" placeholder={t('inputs.username')} />
                    <FormTextField name="password" type="password" placeholder={t('inputs.password')} />
                    <FormTextField name="confirmPassword" type="password" placeholder={t('inputs.confirmPassword')} />
                    <Button type="submit" className="w-100 btn btn-outline-primary" variant="null">{t('interfaces.signup')}</Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="error-field row justify-content-center align-content-center m-10">{registered === null ? null : t('validation.userExists')}</div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
