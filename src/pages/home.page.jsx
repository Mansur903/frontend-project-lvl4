/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Formik, Field, Form,
} from 'formik';
import {
  Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';
import _ from 'lodash';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AddChannelModal from '../modals/AddChannelModal.jsx';
import RemoveChannelModal from '../modals/RemoveChannelModal.jsx';
import RenameChannelModal from '../modals/RenameChannelModal.jsx';
import useAuth from '../hooks/index.jsx';
import {
  initChannels, initMessages, chooseChannel, openAddModal, openRemoveModal,
  setDropdownId, openRenameModal, setAuthNull,
} from '../slices/chatSlice.js';

function HomePage(props) {
  const { logIn, logOut } = useAuth();
  const history = useHistory();
  const goLogin = () => {
    history.push('/login');
  };

  const { t } = useTranslation();

  // сокет:
  const { socket } = props;

  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const selectChannel = (id) => () => {
    dispatch(chooseChannel(id));
  };

  const addChannel = () => {
    dispatch(openAddModal());
  };

  const removeChannel = () => {
    dispatch(openRemoveModal());
  };

  const openDropdown = (id) => () => {
    dispatch(setDropdownId(id));
  };

  const renameChannel = () => {
    dispatch(openRenameModal());
  };

  const handleLogOut = () => {
    logOut();
    dispatch(setAuthNull());
  };

  const renderChannels = (channels) => channels.map((item) => {
    const channelClass = cn('w-100', 'rounded-0', 'text-start', {
      btn: chatState.activeChannel !== item.id,
      'btn-secondary': chatState.activeChannel === item.id,
    });
    const variant = cn({
      null: chatState.activeChannel !== item.id,
      secondary: chatState.activeChannel === item.id,
    });
    if (item.removable === true) {
      return (
        <li
          className="nav-item w-100"
          id={item.id}
          key={item.id}
        >
          <div className="d-flex dropdown btn-group">
            <Dropdown className="w-100" as={ButtonGroup}>
              <Button
                className={channelClass}
                id={item.id}
                key={item.id}
                variant={variant}
                onClick={selectChannel(item.id)}
              >
                <span className="me-1">#</span>
                {item.name}
              </Button>

              <Dropdown.Toggle variant={variant} split id="dropdown-split-basic" />

              <Dropdown.Menu onClick={openDropdown(item.id)}>
                <Dropdown.Item onClick={removeChannel}>{t('delete')}</Dropdown.Item>
                <Dropdown.Item onClick={renameChannel}>{t('rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </li>
      );
    }
    return (
      <li
        className="nav-item w-100"
        id={item.id}
        key={item.id}
      >
        <Button
          className={channelClass}
          id={item.id}
          key={item.id}
          variant={variant}
          onClick={selectChannel(item.id)}
        >
          <span className="me-1">#</span>
          {item.name}
        </Button>
      </li>
    );
  });

  const renderMessages = () => {
    const { activeChannel } = chatState;
    const messages = chatState.messages
      .filter((item) => item.channel === Number(activeChannel))
      .map((item) => item.textfield);
    return messages.map((item) => <div className="chat-messages overflow-auto px-5" key={_.uniqueId()}>{item}</div>);
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
        dispatch(initChannels(response.data.channels));
        dispatch(initMessages(response.data.messages));
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
  }, []);

  return (
    <>
      <div className="d-flex flex-column h-100">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <a className="navbar-brand" href="/">{t('chatTitle')}</a>
            <Link to="/login"><button type="button" onClick={handleLogOut} className="btn btn-primary">{t('logOut')}</button></Link>
          </div>
        </nav>

        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
              <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                <span>{t('channels')}</span>
                <button onClick={addChannel} type="button" className="p-0 text-primary btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <span className="visually-hidden">+</span>
                </button>
              </div>
              <ul className="nav flex-column nav-pills nav-fill px-2">
                {renderChannels(chatState.channels)}
              </ul>
            </div>
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="m-0" />
                  <span className="text-muted" />
                </div>
                <div className="chat-messages overflow-auto px-5 " id="messages-box">
                  {renderMessages()}
                </div>
                <div className="mt-auto px-5 py-3">
                  <Formik
                    initialValues={{ textfield: '' }}
                    onSubmit={(values, { resetForm }) => {
                      const message = values;
                      message.channel = Number(chatState.activeChannel);
                      socket.emit('newMessage', message);
                      resetForm();
                    }}
                  >
                    {(formProps) => {
                      const { handleSubmit } = formProps;
                      return (
                        <Form className="d-flex py-1 border rounded-2" onSubmit={handleSubmit}>
                          <Field className="border-0 p-0 ps-2 form-control" id="textfield" name="textfield" aria-label="Новое сообщение" placeholder={t('enterMessage')} />
                          <Button variant="null" type="submit" className="btn btn-group-vertical" disabled="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg>
                            <span className="visually-hidden">{t('send')}</span>
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {AddChannelModal(socket)}
      {RemoveChannelModal(socket)}
      {RenameChannelModal(socket)}
    </>
  );
}

export default HomePage;
