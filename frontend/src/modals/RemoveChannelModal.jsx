import React from 'react';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  modalActions, getModalStatus, getModalType, getDropdownId,
} from '../slices/modal';
import showToast from '../utilities';
import useApi from '../hooks/api.jsx';

function RemoveChannelModal() {
  const api = useApi();

  const isOpened = useSelector(getModalStatus);
  const modalType = useSelector(getModalType);
  const clickedDropdownId = useSelector(getDropdownId);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleDeleteChannel = (id) => async (e) => {
    e.preventDefault();
    try {
      await api.removeChannel(id);
    } catch {
      t('info.removeChannelError');
    }
    handleClose();
    showToast('success', t('toasts.channelDeleted'));
  };

  return (
    <Modal show={modalType === 'remove' && isOpened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>{t('info.areYouSure')}</Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-secondary" type="button" onClick={handleClose}>{t('interfaces.cancel')}</Button>
          <Button className="btn btn-danger" type="submit" onClick={handleDeleteChannel(clickedDropdownId)}>{t('channels.delete')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RemoveChannelModal;
