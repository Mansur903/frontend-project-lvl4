import React, { useRef, useEffect } from 'react';
import {
  Formik, Field, Form,
} from 'formik';
import {
  Modal, FormGroup, Button,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { object, string } from 'yup';

import { modalActions } from '../slices/modal';
import showToast, { selectors } from '../utilities';
import useApi from '../hooks/api.jsx';

function AddChannelModal() {
  const socket = useApi();
  const { modal, channels } = selectors();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const formSchema = object({
    channelName: string().required(t('requiredField')),
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  });

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleAddChannel = (values) => {
    const newChannel = { name: filter.clean(values.channelName) };
    const addedChannels = channels.map((channel) => channel.name);
    if (!addedChannels.includes(values.channelName)) {
      socket.emit('newChannel', newChannel);
      showToast('success', t('channelCreated'));
    } else {
      showToast('error', t('channelExists'));
    }
    handleClose();
  };

  return (
    <Modal show={modal.add} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('createChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ channelName: '' }}
        validationSchema={formSchema}
        onSubmit={(values) => {
          handleAddChannel(values);
        }}
      >
        {(formProps) => (
          <Form>
            <Modal.Body>
              <FormGroup className="form-group">
                <Field className="mb-2 form-control" data-testid="input-body" id="channelName" name="channelName" type="text" />
                {formProps.errors.channelName ? (
                  <div className="error-field">{formProps.errors.channelName}</div>
                ) : null}
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('cancel')}</Button>
              <Button className="btn btn-primary" type="submit">{t('create')}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default AddChannelModal;
