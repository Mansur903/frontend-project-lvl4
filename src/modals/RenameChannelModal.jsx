import React, { useRef, useEffect } from 'react';
import {
  Formik, Field, Form,
} from 'formik';
import {
  Modal, FormGroup, Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { object, string } from 'yup';

import {
  modalActions, getModalStatus, getModalType, getDropdownId,
} from '../slices/modal';
import { getChannels } from '../slices/channelsInfo';
import showToast from '../utilities';
import useApi from '../hooks/api.jsx';

function RenameChannelModal() {
  const api = useApi();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const isOpened = useSelector(getModalStatus);
  const modalType = useSelector(getModalType);
  const channels = useSelector(getChannels);
  const clickedDropdownId = useSelector(getDropdownId);

  const formSchema = object({
    channelName: string().required(t('validation.requiredField')),
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  });

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleRenameChannel = async (id, values) => {
    const name = filter.clean(values.channelName);
    const addedChannels = channels.map((channel) => channel.name);
    if (!addedChannels.includes(values.channelName)) {
      await api.renameChannel({ id, name });
      showToast('success', t('toasts.channelRenamed'));
    } else {
      showToast('error', t('toasts.channelExists'));
    }
    handleClose();
  };

  return (
    <Modal show={modalType === 'rename' && isOpened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ channelName: '' }}
        validationSchema={formSchema}
        onSubmit={(values) => {
          handleRenameChannel(clickedDropdownId, values);
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
              <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('interfaces.cancel')}</Button>
              <Button className="btn btn-primary" type="submit">{t('channels.rename')}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default RenameChannelModal;
