import React from 'react';
import {
  Modal, Button,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../slices/chatSlice.js';

function RemoveChannelModal(props) {
  const socket = props;

  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleDeleteChannel = (id) => () => {
    socket.emit('removeChannel', { id });
    handleClose();
  };

  return (
    <Modal show={chatState.modal.remove} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>Уверены?</Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-secondary" type="submit" onClick={handleClose}>Отменить</Button>
        <Button className="btn btn-danger" type="submit" onClick={handleDeleteChannel(chatState.clickedDropdownId)}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemoveChannelModal;
