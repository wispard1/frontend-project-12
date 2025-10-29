// src/components/modals/ChannelModals.jsx
import { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const validateChannelName = (name, t) => {
  if (!name) return t('chatPage.modals.addChannel.form.errors.required');
  if (name.length < 3) return t('chatPage.modals.addChannel.form.errors.min');
  if (name.length > 20) return t('chatPage.modals.addChannel.form.errors.max');
  return null;
};

export const AddChannelModal = ({ show, onHide, onAdd, isAdding }) => {
  const { t } = useTranslation();
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateChannelName(channelName.trim(), t);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await onAdd(channelName.trim());
      setChannelName('');
      setError('');
      onHide();
    } catch (err) {
      console.error('Add channel failed:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='add-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.addChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type='text'
            name='name'
            id='name'
            className='mb-2'
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value);
              setError('');
            }}
            autoFocus
            disabled={isAdding}
            isInvalid={!!error}
            data-testid='add-channel-input'
          />

          <div className='invalid-feedback' style={{ display: error ? 'block' : 'none' }}>
            {error}
          </div>

          <div className='d-flex justify-content-end mt-3'>
            <Button
              type='button'
              variant='secondary'
              onClick={onHide}
              disabled={isAdding}
              className='me-2'
              data-testid='add-channel-cancel'
            >
              {t('chatPage.modals.addChannel.cancelButton')}
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={isAdding || !channelName.trim()}
              data-testid='add-channel-submit'
            >
              {isAdding ? (
                <>
                  <Spinner size='sm' animation='border' /> {t('chatPage.modals.addChannel.submittingButton')}
                </>
              ) : (
                t('chatPage.modals.addChannel.submitButton')
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const RenameChannelModal = ({ show, onHide, onRename, isRenaming, channel }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState(channel?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateChannelName(newName.trim(), t);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newName.trim() === channel.name) {
      onHide();
      return;
    }

    await onRename(channel.id, newName.trim());
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='rename-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='renameChannelName' className='mb-3'>
            <Form.Control
              type='text'
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              autoFocus
              disabled={isRenaming}
              isInvalid={!!error}
            />
            {error && <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={isRenaming}>
          {t('chatPage.modals.renameChannel.cancelButton')}
        </Button>
        <Button
          variant='primary'
          onClick={handleSubmit}
          disabled={isRenaming || !newName.trim() || newName.trim() === channel.name}
          data-testid='rename-channel-submit'
        >
          {isRenaming ? (
            <>
              <Spinner size='sm' animation='border' /> {t('chatPage.modals.renameChannel.submittingButton')}
            </>
          ) : (
            t('chatPage.modals.renameChannel.submitButton')
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const RemoveChannelModal = ({ show, onHide, onRemove, isRemoving, channel }) => {
  const { t } = useTranslation();

  const handleRemove = async () => {
    await onRemove(channel.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='remove-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='lead'>{t('chatPage.confirmMessage')}</p>
        <div className='d-flex justify-content-end'>
          <Button
            variant='secondary'
            onClick={onHide}
            disabled={isRemoving}
            className='me-2'
            data-testid='remove-channel-cancel'
          >
            {t('chatPage.modals.removeChannel.cancelButton')}
          </Button>
          <Button variant='danger' onClick={handleRemove} disabled={isRemoving} data-testid='remove-channel-confirm'>
            {isRemoving ? (
              <>
                <Spinner size='sm' animation='border' /> {t('chatPage.modals.removeChannel.submittingButton')}
              </>
            ) : (
              t('chatPage.modals.removeChannel.submitButton')
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
