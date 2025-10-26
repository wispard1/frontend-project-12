// src/components/MessagesList.jsx
import { useTranslation } from 'react-i18next';

export const MessagesList = ({ messages }) => {
  const { t } = useTranslation();

  console.log('MessagesList rendering, messages count:', messages?.length);

  if (!messages || messages.length === 0) {
    return (
      <div className='chat-messages overflow-auto px-4 flex-grow-1 d-flex align-items-center justify-content-center'>
        <div className='text-center text-muted'>
          <p>{t('chatPage.noMessagesYet')}</p>
          <small>{t('chatPage.startConversation')}</small>
        </div>
      </div>
    );
  }

  return (
    <div id='messages-box' className='px-5 overflow-auto'>
      {messages.map((message) => (
        <div key={message.id} className='text-break mb-2'>
          <b>{message.username}</b>: {message.body}
        </div>
      ))}
    </div>
  );
};
