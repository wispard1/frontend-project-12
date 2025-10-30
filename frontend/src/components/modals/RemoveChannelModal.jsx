import { Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const RemoveChannelModal = ({ show, onHide, onRemove, isRemoving, channel }) => {
  const { t } = useTranslation();

  const handleRemove = async () => {
    try {
      await onRemove(channel.id);
      toast.success(t('chatPage.notifications.channelRemoved'));
      onHide();
    } catch (err) {
      toast.error(t('chatPage.notifications.channelRemoveError'));
      console.error('Remove channel failed:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='remove-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='lead'>{t('chatPage.confirmMessage')}</p>
        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='me-2 btn btn-secondary'
            onClick={onHide}
            disabled={isRemoving}
            data-testid='remove-channel-cancel'
          >
            {t('chatPage.modals.removeChannel.cancelButton')}
          </button>
          <button
            type='button'
            className='btn btn-danger'
            onClick={handleRemove}
            disabled={isRemoving}
            data-testid='remove-channel-confirm'
          >
            {isRemoving ? (
              <>
                <Spinner size='sm' animation='border' /> {t('chatPage.modals.removeChannel.submittingButton')}
              </>
            ) : (
              t('chatPage.modals.removeChannel.submitButton')
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};