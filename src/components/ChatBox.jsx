import React from 'react';
import {
  Formik, Field, Form,
} from 'formik';
import { object, string } from 'yup';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Messages from './Messages.jsx';
import useApi from '../hooks/api.jsx';
import useAuth from '../hooks/auth.jsx';
import { getActiveChannel } from '../slices/channelsInfo';

const messageSchema = object({
  textfield: string().required(),
});

function ChatBox() {
  const { t } = useTranslation();
  const api = useApi();
  const { user } = useAuth();
  const activeChannel = useSelector(getActiveChannel);

  const handleSubmit = (values, resetForm) => {
    const filteredValues = { textfield: filter.clean(values.textfield) };
    const message = { ...filteredValues, channel: Number(activeChannel), username: user };
    api.newMessage(message);
    resetForm();
  };

  return (
    <>
      <Messages />
      <div className="mt-auto px-5 py-3">
        <Formik
          initialValues={{ textfield: '' }}
          validationSchema={messageSchema}
          validateOnMount
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        >
          {({ isValid }) => (
            <Form className="d-flex py-1 border rounded-2">
              <Field className="border-0 p-0 ps-2 form-control" id="textfield" name="textfield" aria-label={t('newMessage')} placeholder={t('enterMessage')} />
              <Button variant="null" type="submit" className="btn btn-group-vertical" disabled={!isValid}>
                <ArrowRightSquare width="20" height="20" />
                <span className="visually-hidden">{t('send')}</span>
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ChatBox;
