import React, { useRef, useEffect } from 'react';
import {
  Formik, Form,
} from 'formik';
import {
  Modal, FormGroup, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { object, string } from 'yup';

import { modalActions, getModalStatus, getModalType } from '../slices/modal';
import showToast from '../utilities';
import useApi from '../hooks/api.jsx';
import { getChannels } from '../slices/channelsInfo.js';
import FormTextField from '../components/FormTextField.jsx';

function AddChannelModal() {
  const api = useApi();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const channels = useSelector(getChannels);
  const isOpened = useSelector(getModalStatus);
  const modalType = useSelector(getModalType);

  const formSchema = object({
    channelName: string().required(),
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  }, [isOpened]);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleAddChannel = async (values) => {
    const newChannel = { name: filter.clean(values.channelName) };
    const addedChannels = channels.map((channel) => channel.name);
    if (!addedChannels.includes(values.channelName)) {
      try {
        await api.newChannel(newChannel);
      } catch {
        t('info.newChannelError');
      }
      showToast('success', t('toasts.channelCreated'));
    } else {
      showToast('error', t('toasts.channelExists'));
    }
    handleClose();
  };

  return (
    <Modal show={modalType === 'add' && isOpened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.createChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ channelName: '' }}
        validationSchema={formSchema}
        validateOnMount
        onSubmit={handleAddChannel}
      >
        {({
          isValid,
        }) => (
          <Form>
            <Modal.Body>
              <FormGroup className="form-group">
                <FormTextField className="mb-2 form-control" name="channelName" type="text" placeholder={t('channels.channelName')} ref={inputRef} />
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('interfaces.cancel')}</Button>
              <Button className="btn btn-primary" disabled={!isValid} type="submit">{t('interfaces.create')}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default AddChannelModal;
