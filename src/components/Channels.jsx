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
  const { channel, channelClass, variant } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectChannel = (id) => () => {
    dispatch(channelsActions.setActiveChannel(id));
  };
  const openRemoveModal = () => {
    dispatch(modalActions.openRemoveModal(channel.id));
  };
  const openRenameModal = () => {
    dispatch(modalActions.openRenameModal(channel.id));
  };

  return (
    <li
      className="nav-item w-100"
      id={channel.id}
      key={channel.id}
    >
      {channel.removable ? (
        <div className="d-flex dropdown btn-group">
          <Dropdown className="w-100" as={ButtonGroup}>
            <Button
              className={channelClass}
              id={channel.id}
              key={channel.id}
              variant={variant}
              onClick={selectChannel(channel.id)}
            >
              <span className="me-1">#</span>
              {channel.name}
            </Button>
            <Dropdown.Toggle variant={variant} split id="dropdown-split-basic" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={openRemoveModal}>{t('delete')}</Dropdown.Item>
              <Dropdown.Item onClick={openRenameModal}>{t('rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <Button
          className={channelClass}
          id={channel.id}
          key={channel.id}
          variant={variant}
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

  const RenderChannels = React.useCallback(() => channels.map((item) => {
    const channelClass = cn('w-100', 'rounded-0', 'text-start', {
      btn: activeChannel !== item.id,
      'btn-secondary': activeChannel === item.id,
    });
    const variant = activeChannel === item.id ? 'secondary' : null;
    return (
      <Channel channel={item} channelClass={channelClass} variant={variant} key={item.id} />
    );
  }), [channels, activeChannel]);

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      <RenderChannels />
    </ul>
  );
}

export default Channels;
