import React from 'react';
import { useField } from 'formik';

import TextField from './TextField.jsx';

const FormTextField = React.forwardRef((props, ref) => {
  const [field, meta] = useField(props.name);
  return (
    <TextField {...field} {...props} ref={ref} error={meta.error && meta.touched} helperText={meta.touched && meta.error ? meta.error : props.hint} /> // eslint-disable-line max-len, react/jsx-props-no-spreading
  );
});

export default FormTextField;
