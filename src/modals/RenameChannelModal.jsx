import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';

import { closeModal } from '../slices/chatSlice.js';

function RenameChannelModal(props) {
  const socket = props;
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t('channelRenamed'), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyError = () => toast.error(t('channelExists'), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: (e) => {
      e.preventDefault();
    },
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleRenameChannel = (id) => (e) => {
    e.preventDefault();
    const name = filter.clean(formik.values.channelName);
    const addedChannels = chatState.channels.map((channel) => channel.name);
    if (!addedChannels.includes(formik.values.channelName)) {
      socket.emit('renameChannel', { id, name });
      notifySuccess();
    } else {
      console.log('Такое название канала уже существует');
      notifyError();
    }
    handleClose();
  };

  return (
    <Modal show={chatState.modal.rename} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>
          <FormGroup className="form-group">
            <FormControl data-testid="input-body" ref={inputRef} id="channelName" name="channelName" type="text" onChange={formik.handleChange} value={formik.values.channel} />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('cancel')}</Button>
          <Button className="btn btn-primary" type="submit" onClick={handleRenameChannel(chatState.clickedDropdownId)}>{t('rename')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RenameChannelModal;
