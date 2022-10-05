import React from 'react';
import { useField } from 'formik';

import TextField from './TextField.jsx';

function FormTextField({ name, hint = null, ...props }) {
  const [field, meta] = useField(name);

  return (
    <TextField {...field} {...props} error={meta.error && meta.touched} helperText={meta.touched && meta.error ? meta.error : hint} /> // eslint-disable-line max-len, react/jsx-props-no-spreading
  );
}

export default FormTextField;
