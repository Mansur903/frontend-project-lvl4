import React from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { authSuccess, authError } from './slices/chatSlice';
import MyImage from '../images/hexlet-image.jpg';
// Хуки находятся в react-redux

const userSchema = object({
  username: string().min(3, 'Должно быть 3 или более символов').required('Это обязательное поле'),
  password: string().min(4, 'Должно быть 4 или более символов').required('Это обязательное поле'),
});

const loginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  console.log('chatState :', chatState);
  const goHome = () => {
    history.push('/');
  };

  const errorField = cn({
    'error-field': !chatState.authorized,
    'no-error-field': chatState.authorized,
  });

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">My Chat</a>
          <button type="button" className="btn btn-primary">Выйти</button>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={MyImage} alt="Войти" className="rounded-circle" />
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
                      <h1 className="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <Field className="form-control" name="username" id="username" placeholder="Ваш ник" required />
                        <label htmlFor="username">Ваш ник</label>
                        {errors.username && touched.username ? (<div className="error-field">{errors.username}</div>) : null}
                      </div>
                      <div className="form-floating mb-4">
                        <Field className="form-control" name="password" id="password" placeholder="Ваш ник" type="password" />
                        <label htmlFor="password">Пароль</label>
                        {errors.password && touched.password ? (<div className="error-field">{errors.password}</div>) : null}
                      </div>
                      <button className="w-100 mb-3 btn btn-outline-primary" type="submit">Войти</button>
                      <div className={errorField}>Неправильно введён логин или пароль</div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LoginPage() {
  return (
    <>
      {loginForm()}
    </>
  );
}

export default LoginPage;
