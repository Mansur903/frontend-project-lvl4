import React from 'react';
import { Form } from 'react-bootstrap';
import cn from 'classnames';

const TextField = React.forwardRef((props, ref) => {
  const {
    name, placeholder, error, type, helperText, ...rest
  } = props;
  return (
    <Form.Group className="mb-3">
      <Form.Control
        className="field"
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        {...rest} // eslint-disable-line react/jsx-props-no-spreading
        ref={ref}
      />
      <Form.Label htmlFor={name} className="visually-hidden">{placeholder}</Form.Label>
      {helperText && <Form.Text className={cn({ 'error-field': error })}>{helperText}</Form.Text>}
    </Form.Group>
  )
})

export default TextField;
