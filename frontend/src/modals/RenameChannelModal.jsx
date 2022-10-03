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

import {
  modalActions, getModalStatus, getModalType, getDropdownId,
} from '../slices/modal';
import { getChannels } from '../slices/channelsInfo';
import showToast from '../utilities';
import useApi from '../hooks/api.jsx';
import FormTextField from '../components/FormTextField.jsx';

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
    channelName: string().required(),
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  }, [isOpened]);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleRenameChannel = async (id, values) => {
    const name = filter.clean(values.channelName);
    const addedChannels = channels.map((channel) => channel.name);
    if (!addedChannels.includes(values.channelName)) {
      try {
        await api.renameChannel({ id, name });
      } catch {
        t('info.renameChannelError');
      }
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
        validateOnMount
        onSubmit={(values) => {
          handleRenameChannel(clickedDropdownId, values);
        }}
      >
        {({
          isValid,
        }) => (
          <Form>
            <Modal.Body>
              <FormGroup className="form-group">
                <FormTextField className="mb-2 form-control" name="channelName" type="text" placeholder={t('channels.channelName')} inputEl={inputRef} />
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('interfaces.cancel')}</Button>
              <Button className="btn btn-primary" type="submit" disabled={!isValid}>{t('channels.rename')}</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default RenameChannelModal;
