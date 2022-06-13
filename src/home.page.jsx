/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Formik, Field,
} from 'formik';
import _ from 'lodash';
import cn from 'classnames';

import { useSelector, useDispatch } from 'react-redux';
import useAuth from './hooks/index.jsx';
// Импортируем нужные действия
import {
  initChannels, initMessages, chooseChannel, newMessage,
} from './slices/chatSlice.js';

function HomePage(props) {
  const { logIn, logOut } = useAuth();
  const history = useHistory();
  const goLogin = () => {
    history.push('/login');
  };

  // сокет:
  const { socket } = props;
  console.log(socket);

  const chatState = useSelector((state) => state);
  const dispatch = useDispatch();

  const selectChannel = (id) => () => {
    document.querySelectorAll('.channels__item').forEach((item) => item.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    dispatch(chooseChannel(id));
  };

  // eslint-disable-next-line functional/no-let
  let idCounter = 0;
  const renderChannels = (channels) => channels.map((item) => {
    idCounter += 1;
    const channelClass = cn('channels__item', {
      active: idCounter === 1,
    });
    return (
      <li
        onClick={selectChannel(idCounter)}
        id={idCounter}
        key={idCounter}
        className={channelClass}
      >
        #
        {' '}
        {item.name}
      </li>
    );
  });

  const renderMessages = () => {
    const { activeChannel } = chatState.chat;
    const messages = chatState.chat.messages
      .filter((item) => item.channel === Number(activeChannel))
      .map((item) => item.textfield);
    return messages.map((item) => <li className="chat__message" key={_.uniqueId()}>{item}</li>);
  };

  const getData = () => {
    axios.get(
      '/api/v1/data',
      {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      },
    )
      .then((response) => {
        console.log(response);
        dispatch(initChannels(response.data.channels));
        dispatch(initMessages(response.data.messages));
      })
      .then(() => {

      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    if (localStorage.token === undefined) {
      logOut();
      goLogin();
    } else {
      logIn();
      getData();
    }
    console.log('under useffect');

    socket.on('connect', () => {
      socket.on('newMessage', (receivedMessage) => {
        dispatch(newMessage(receivedMessage));
      });
    });
  }, []);

  return (
    <>
      <div>This is HomePage</div>
      <div className="chat-box">
        <div className="channels">
          <h6 className="title">Channels</h6>
          <ul className="channels__list">
            {renderChannels(chatState.chat.channels)}
          </ul>
        </div>
        <div className="chat">
          <h6 className="title">Chat</h6>
          <ul className="chat__field">{renderMessages()}</ul>
          <Formik
            initialValues={{ textfield: '' }}
            onSubmit={(values, { resetForm }) => {
              const message = values;
              message.channel = Number(chatState.chat.activeChannel);
              socket.emit('newMessage', message);
              console.log('socket :', socket);
              resetForm();
            }}
          >
            {(formProps) => {
              const { handleSubmit } = formProps;
              return (
                <form onSubmit={handleSubmit}>
                  <Field className="input" id="textfield" name="textfield" placeholder="Введите сообщение" />
                  <button type="submit">Submit</button>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default HomePage;
