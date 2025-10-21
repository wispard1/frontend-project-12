// src/components/toasts/RemoveChannelToastContent.jsx
import { Button, Spinner } from 'react-bootstrap';

export const RemoveChannelToastContent = ({ channel, onRemove, isRemoving, t, closeToast }) => {
  return (
    <div>
      <p>{t('chatPage.confirmRemove', { channelName: channel.name })}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          variant='danger'
          size='sm'
          onClick={async () => {
            try {
              await onRemove(channel.id);
              closeToast();
            } catch {
            //   toast.error(t('chatPage.errorRemovingChannel'));
            }
          }}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <>
              <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
              <span className='ms-2'>{t('chatPage.removing')}</span>
            </>
          ) : (
            t('chatPage.remove')
          )}
        </Button>
        <Button variant='secondary' size='sm' onClick={closeToast} disabled={isRemoving}>
          {t('chatPage.cancel')}
        </Button>
      </div>
    </div>
  );
};
