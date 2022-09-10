import React from 'react';
import _ from 'lodash';

import { selectors } from '../utilities';

function Messages() {
  const { messages, activeChannel } = selectors();

  const createMessage = (user, message) => (
    <>
      <b>{user}</b>
      :
      {' '}
      {message}
    </>
  );

  const renderMessages = () => {
    const messagesList = messages
      .filter((item) => item.channel === +activeChannel);
    return messagesList.reverse().map((item) => (
      <div className="text-break mb-2" key={_.uniqueId()}>
        {createMessage(item.username, item.textfield)}
      </div>
    ));
  };

  return (
    <div className="chat-messages overflow-auto px-5 " id="messages-box">
      {renderMessages()}
    </div>
  );
}

export default Messages;
