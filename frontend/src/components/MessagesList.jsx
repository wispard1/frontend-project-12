import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const MessagesList = ({ messages }) => {
  const currentUsername = useSelector((state) => state.auth.user?.username);
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
    <div id='messages-box' className='chat-messages overflow-auto px-4 flex-grow-1'>
      {messages.map((message) => {
        const isOwnMessage = message.username === currentUsername;

        return (
          <div
            key={message.id}
            className={`mb-2 d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`text-break mb-2 p-2 rounded ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'}`}
              style={{ maxWidth: '70%' }}
            >
              <b>{message.username}</b>: {message.body}
            </div>
          </div>
        );
      })}
    </div>
  );
};
