import React from 'react';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { modalActions } from '../slices/modal';
import showToast, { selectors } from '../utilities';
import useApi from '../hooks/api.jsx';

function RemoveChannelModal() {
  const socket = useApi();

  const { modal, dropdown } = selectors();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleDeleteChannel = (id) => (e) => {
    e.preventDefault();
    socket.emit('removeChannel', { id });
    handleClose();
    showToast('success', t('channelDeleted'));
  };

  return (
    <Modal show={modal.remove} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>{t('areYouSure')}</Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('cancel')}</Button>
          <Button className="btn btn-danger" type="submit" onClick={handleDeleteChannel(dropdown.clickedDropdownId)}>{t('delete')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RemoveChannelModal;
