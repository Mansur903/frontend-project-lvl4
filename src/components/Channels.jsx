import React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import {
  Dropdown, Button, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { channelsActions } from '../slices/channelsInfo';
import { modalActions } from '../slices/modal';
import { dropdownActions } from '../slices/dropdown';
import { selectors } from '../utilities';

function Channels() {
  const { channels, activeChannel } = selectors();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const selectChannel = (id) => () => {
    dispatch(channelsActions.chooseChannel(id));
  };

  const removeChannel = () => {
    dispatch(modalActions.openRemoveModal());
  };

  const renameChannel = () => {
    dispatch(modalActions.openRenameModal());
  };

  const openDropdown = (id) => () => {
    dispatch(dropdownActions.setDropdownId(id));
  };

  const renderChannels = (channelsList) => channelsList.map((item) => {
    const channelClass = cn('w-100', 'rounded-0', 'text-start', {
      btn: activeChannel !== item.id,
      'btn-secondary': activeChannel === item.id,
    });
    const variant = cn({
      null: activeChannel !== item.id,
      secondary: activeChannel === item.id,
    });
    return (
      <li
        className="nav-item w-100"
        id={item.id}
        key={item.id}
      >
        {item.removable === true ? (
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
        ) : (
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
        )}
      </li>
    );
  });

  return (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {renderChannels(channels)}
    </ul>
  );
}

export default Channels;
