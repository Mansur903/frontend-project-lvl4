import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form, Button,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../slices/chatSlice.js';

function AddChannelModal(props) {
  const socket = props;
  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

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

  const handleAddChannel = (e) => {
    e.preventDefault();
    const newChannel = {};
    newChannel.name = formik.values.channelName;
    const addedChannels = chatState.channels.map((channel) => channel.name);
    console.log('includes?: ', addedChannels.includes(formik.values.channelName));
    if (!addedChannels.includes(formik.values.channelName)) {
      socket.emit('newChannel', newChannel);
    } else {
      console.log('Такое название канала уже существует');
    }
    handleClose();
  };

  return (
    <Modal show={chatState.modal.add} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Создать канал</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <FormGroup className="form-group">
            <FormControl data-testid="input-body" ref={inputRef} id="channelName" name="channelName" type="text" onChange={formik.handleChange} value={formik.values.task} />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-secondary" type="button" onClick={handleClose}>Отменить</Button>
          <Button className="btn btn-primary" type="submit" onClick={handleAddChannel}>Создать</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddChannelModal;
