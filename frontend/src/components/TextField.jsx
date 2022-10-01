import React from 'react';
import { Form } from 'react-bootstrap';
import cn from 'classnames';

function TextField(props) {
  const {
    name, placeholder, error, type, helperText, inputEl, ...rest
  } = props;
  return (
    <Form.Group className="mb-3">
      <Form.Control
        className="field"
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        {...rest}
        ref={inputEl}
      />
      {helperText && <Form.Text className={cn({ 'error-field': error })}>{helperText}</Form.Text>}
    </Form.Group>
  );
}

export default TextField;