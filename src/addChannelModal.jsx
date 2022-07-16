import React, { useRef } from 'react';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal, chooseChannel } from './slices/chatSlice.js';

const addChannelModal = (props) => {
  const socket = props;
  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    onSubmit: '',
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleAddChannel = () => {
    const newChannel = {};
    newChannel.name = formik.values.channelName;
    const addedChannels = chatState.channels.map((channel) => channel.name);
    console.log('includes?: ', addedChannels.includes(formik.values.channelName));
    if (!addedChannels.includes(formik.values.channelName)) {
      socket.emit('newChannel', newChannel);
    } else {
      console.log('Такое название канала уже существует');
    }
    // const newChannelIndex = chatState.channels.length - 1;
    // const { id } = chatState.channels[newChannelIndex];
    dispatch(closeModal());
  };

  return (
    <Modal show={chatState.modal.opened} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Создать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <FormGroup className="form-group">
            <FormControl data-testid="input-body" ref={inputRef} id="channelName" name="channelName" type="text" onChange={formik.handleChange} value={formik.values.task} />
          </FormGroup>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <input className="btn btn-secondary" type="submit" value="Отменить" onClick={handleClose} />
        <input className="btn btn-primary" type="submit" value="Создать" onClick={handleAddChannel} />
      </Modal.Footer>
    </Modal>
  );
};

export default addChannelModal;
