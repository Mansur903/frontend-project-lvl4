import React from 'react';
import { useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import { getMessagesById } from '../slices/messagesInfo';
import { getActiveChannel } from '../slices/channelsInfo';

function Message({ user, message }) {
  return (
    <>
      <b>{user}</b>
      :
      {' '}
      {message}
    </>
  );
}

function Messages() {
  const activeChannel = useSelector(getActiveChannel);
  const messagesList = useSelector(getMessagesById(activeChannel));
  const messages = useSelector(getMessagesById(activeChannel));

  React.useEffect(() => {
    scroll.scrollToBottom({
      containerId: 'messages-box',
      duration: 100,
    });
  }, [messages]);

  return (
    <div className="chat-messages overflow-auto px-5 " id="messages-box">
      {messagesList.map((item) => (
        <div className="text-break mb-2" key={item.id}>
          <Message user={item.username} message={item.body} />
        </div>
      ))}
    </div>
  );
}

export default Messages;
