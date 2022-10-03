import React from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { channelsActions, getChannels, getActiveChannel } from '../slices/channelsInfo';
import { modalActions } from '../slices/modal';

function Channel(props) {
  const {
    channel, isActive, selectChannel, openRemoveModal, openRenameModal,
  } = props;
  const activeChannel = useSelector(getActiveChannel);
  const { t } = useTranslation();

  const channelClass = cn('w-100', 'rounded-0', 'text-start', {
    btn: activeChannel !== channel.id,
    'btn-secondary': activeChannel === channel.id,
  });

  return (
    <li
      className="nav-item w-100"
      key={channel.id}
    >
      {channel.removable ? (
        <Dropdown className="w-100" as={ButtonGroup}>
          <Button
            className={channelClass}
            key={channel.id}
            variant={isActive ? 'secondary' : null}
            onClick={selectChannel(channel.id)}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle variant={isActive ? 'secondary' : null} split id="dropdown-split-basic">
            <span class="visually-hidden">Управление каналом</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={openRemoveModal(channel.id)}>{t('channels.delete')}</Dropdown.Item>
            <Dropdown.Item onClick={openRenameModal(channel.id)}>{t('channels.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          className={channelClass}
          key={channel.id}
          variant={isActive ? 'secondary' : null}
          onClick={selectChannel(channel.id)}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      )}
    </li>
  );
}

function Channels() {
  const channels = useSelector(getChannels);
  const activeChannel = useSelector(getActiveChannel);
  const dispatch = useDispatch();

  const selectChannel = (id) => () => {
    dispatch(channelsActions.setActiveChannel(id));
  };

  const openRemoveModal = (channelId) => () => {
    dispatch(modalActions.openModal({ id: channelId, type: 'remove' }));
  };
  const openRenameModal = (channelId) => () => {
    dispatch(modalActions.openModal({ id: channelId, type: 'rename' }));
  };

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {channels.map((item) => {
        const isActive = activeChannel === item.id;
        return (
          <Channel
            channel={item}
            isActive={isActive}
            key={item.id}
            selectChannel={selectChannel}
            openRemoveModal={openRemoveModal}
            openRenameModal={openRenameModal}
          />
        );
      })}
    </ul>
  );
}

export default Channels;
