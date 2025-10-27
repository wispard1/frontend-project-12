import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const MessagesList = ({ messages }) => {
  const currentUsername = useSelector((state) => state.auth.user?.username);
  const { t } = useTranslation();

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
        return (
          <div
            key={message.id}
            className={`mb-2 d-flex ${
              message.username === currentUsername ? 'justify-content-end' : 'justify-content-start'
            }`}
          >
            <div className='text-break mb-2'>
              <b>{message.username}</b>: {message.body}
            </div>
          </div>
        );
      })}
    </div>
  );
};
