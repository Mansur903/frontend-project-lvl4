import React from 'react';
import { Form } from 'react-bootstrap';

function TextField(props) {
  const {
    name, placeholder, errors, handleChange, handleBlur, touched,
  } = props;

  return (
    <Form.Group className="mb-3">
      <Form.Control
        className="field"
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        id={name}
        placeholder={placeholder}
        type={name === 'password' || name === 'confirmPassword' ? 'password' : null}
        required
      />
      {errors[name] && touched[name] ? (<Form.Text className="error-field">{errors[name]}</Form.Text>) : null}
    </Form.Group>
  );
}

export default TextField;
