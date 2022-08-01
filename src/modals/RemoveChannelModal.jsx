import React from 'react';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { closeModal } from '../slices/chatSlice.js';

function RemoveChannelModal(props) {
  const socket = props;

  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t('channelDeleted'), {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleDeleteChannel = (id) => (e) => {
    e.preventDefault();
    socket.emit('removeChannel', { id });
    handleClose();
    notifySuccess();
  };

  return (
    <Modal show={chatState.modal.remove} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>{t('areYouSure')}</Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('cancel')}</Button>
          <Button className="btn btn-danger" type="submit" onClick={handleDeleteChannel(chatState.clickedDropdownId)}>{t('delete')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RemoveChannelModal;
