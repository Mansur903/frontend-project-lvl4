import React from 'react';
import {
  Formik, Form, Field,
} from 'formik';
import { object, string } from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// Хуки находятся в react-redux

const userSchema = object({
  username: string().min(3, 'Должно быть 3 или более символов').required('Это обязательное поле'),
  password: string().min(4, 'Должно быть 4 или более символов').required('Это обязательное поле'),
});

const loginForm = () => {
  const history = useHistory();
  const goHome = () => {
    history.push('/');
  };

  return (
    <div>
      <h1>Авторизация</h1>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={userSchema}
        onSubmit={(values) => {
          axios.post('/api/v1/login', values)
            .then((response) => {
              localStorage.token = response.data.token;
              goHome();
            })
            .catch((error) => {
              document.querySelector('.error-field').style.display = 'block';
              console.log(error);
            });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field name="username" />
            {errors.username && touched.username ? (<div>{errors.username}</div>) : null}
            <Field name="password" type="password" />
            {errors.password && touched.password ? (<div>{errors.password}</div>) : null}
            <button type="submit">Отправить</button>
            <div className="error-field">Неправильно введён логин или пароль</div>
          </Form>
        )}
      </Formik>
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
