import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export const AddChannelToastContent = ({ onAdd, isAdding, t, closeToast }) => {
  const [channelName, setChannelName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (channelName.trim()) {
      try {
        await onAdd(channelName.trim());
        closeToast();
      } catch {
        toast.error(t('chatPage.errorAddingChannel'));
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='addChannelName' className='mb-3'>
        <Form.Label>{t('chatPage.addChannel')}</Form.Label>
        <Form.Control
          type='text'
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder={t('chatPage.enterChannelName')}
          autoFocus
          disabled={isAdding}
        />
      </Form.Group>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button variant='primary' type='submit' disabled={!channelName.trim() || isAdding}>
          {isAdding ? (
            <>
              <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
              <span className='ms-2'>{t('chatPage.submitting')}</span>
            </>
          ) : (
            t('chatPage.submit')
          )}
        </Button>
        <Button variant='secondary' onClick={closeToast} disabled={isAdding}>
          {t('chatPage.cancel')}
        </Button>
      </div>
    </Form>
  );
};
