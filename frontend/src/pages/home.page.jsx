/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';

import AddChannelModal from '../modals/AddChannelModal.jsx';
import RemoveChannelModal from '../modals/RemoveChannelModal.jsx';
import RenameChannelModal from '../modals/RenameChannelModal.jsx';
import { channelsActions, getActiveChannel, getChannels } from '../slices/channelsInfo';
import { getMessagesById } from '../slices/messagesInfo';
import { modalActions } from '../slices/modal';
import showToast from '../utilities';
import Channels from '../components/Channels.jsx';
import ChatBox from '../components/ChatBox.jsx';
import routes from '../routes';
import useAuth from '../hooks/auth.jsx';

function HomePage() {
  const { t } = useTranslation();
  const { getAuthHeader } = useAuth();
  const [dataReady, setReadyStatus] = React.useState(false);
  const activeChannel = useSelector(getActiveChannel);
  const messages = useSelector(getMessagesById(activeChannel));
  const channels = useSelector(getChannels);

  const dispatch = useDispatch();
  const addChannel = () => {
    dispatch(modalActions.openModal({ type: 'add', id: null }));
  };

  const showErrorToast = (e) => {
    if (e.response.message === 'Network Error') {
      showToast('error', t('toasts.downloadingError'));
      return;
    }
    showToast('error', t('toasts.unknownError'));
  };

  const getData = () => {
    axios.get(
      routes.httpDataPath(),
      {
        headers: getAuthHeader(),
      },
    )
      .then((response) => {
        const { data } = response;
        dispatch(channelsActions.initChannels(data));
        setReadyStatus(true);
      })
      .catch((e) => {
        showErrorToast(e);
      });
  };

  React.useEffect(() => {
    getData();
  }, []);

  const activeChannelName = (id) => channels.filter((channel) => channel.id === id);
  const [channel] = activeChannelName(activeChannel);
  const messagesCounter = () => messages.filter((message) => message.channel === activeChannel).length;

  if (!dataReady) return null;
  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>{t('channels.header')}</span>
              <button onClick={addChannel} type="button" className="p-0 text-primary btn btn-group-vertical">
                <PlusSquare width="20" height="20" />
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <Channels />
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    {`# ${channel.name}`}
                  </b>
                </p>
                <span className="text-muted">
                  {t('messagesCounter', { count: messagesCounter() })}
                </span>
              </div>
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
      <AddChannelModal />
      <RemoveChannelModal />
      <RenameChannelModal />
    </>
  );
}

export default HomePage;
