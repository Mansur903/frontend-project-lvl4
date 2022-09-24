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
  message: string().trim().required(),
});

function ChatBox() {
  const { t } = useTranslation();
  const api = useApi();
  const { user } = useAuth();
  const activeChannel = useSelector(getActiveChannel);

  const handleSubmit = async (values, props) => {
    const { resetForm } = props;
    const message = { body: filter.clean(values.message), channel: activeChannel, username: user };
    try {
      await api.newMessage(message);
    } catch (e) {
      t('info.newMessageError');
    }
    resetForm();
  };

  return (
    <>
      <Messages />
      <div className="mt-auto px-1 py-3">
        <Formik
          initialValues={{ message: '' }}
          validationSchema={messageSchema}
          validateOnMount
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="d-flex py-1 border rounded-2">
              <Field className="border-0 p-0 ps-2 form-control" id="message" name="message" aria-label={t('messages.newMessage')} placeholder={t('messages.inputPlaceholder')} />
              <Button variant="null" type="submit" className="btn btn-group-vertical" disabled={!isValid}>
                <ArrowRightSquare width="20" height="20" />
                <span className="visually-hidden">{t('messages.send')}</span>
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ChatBox;
