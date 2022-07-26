import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../slices/chatSlice.js';

function RenameChannelModal(props) {
  const socket = props;
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: (e) => {
      e.preventDefault();
      console.log('sazcasc');
    },
  });

  useEffect(() => {
    if (inputRef.current !== null) inputRef.current.focus();
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleRenameChannel = (id) => () => {
    const name = formik.values.channelName;
    const addedChannels = chatState.channels.map((channel) => channel.name);
    if (!addedChannels.includes(formik.values.channelName)) {
      socket.emit('renameChannel', { id, name });
    } else {
      console.log('Такое название канала уже существует');
    }
    handleClose();
  };

  return (
    <Modal show={chatState.modal.rename} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <FormGroup className="form-group">
            <FormControl data-testid="input-body" ref={inputRef} id="channelName" name="channelName" type="text" onChange={formik.handleChange} value={formik.values.channel} />
          </FormGroup>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-secondary" type="button" onClick={handleClose}>Отменить</Button>
        <Button className="btn btn-primary" type="submit" onClick={handleRenameChannel(chatState.clickedDropdownId)}>Переименовать</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameChannelModal;
