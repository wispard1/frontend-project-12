import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export const RenameChannelToastContent = ({ channel, onRename, isRenaming, t, closeToast }) => {
  const [channelName, setChannelName] = useState(channel.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName.trim() || channelName === channel.name) return;

    try {
      await onRename(channel.id, channelName.trim());
      closeToast();
    } catch {
      toast.error(t('chatPage.errorRenamingChannel'));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='renameChannelName' className='mb-3'>
        <Form.Label>{t('chatPage.renameChannel')}</Form.Label>
        <Form.Control
          type='text'
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder={t('chatPage.enterChannelName')}
          autoFocus
          disabled={isRenaming}
        />
      </Form.Group>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          variant='primary'
          type='submit'
          disabled={!channelName.trim() || channelName === channel.name || isRenaming}
        >
          {isRenaming ? (
            <>
              <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
              <span className='ms-2'>{t('chatPage.submitting')}</span>
            </>
          ) : (
            t('chatPage.submit')
          )}
        </Button>
        <Button variant='secondary' onClick={closeToast} disabled={isRenaming}>
          {t('chatPage.cancel')}
        </Button>
      </div>
    </Form>
  );
};
