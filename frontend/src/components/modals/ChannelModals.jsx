// src/components/modals/ChannelModals.jsx
import { Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export const AddChannelModal = ({ show, onHide, onAdd, isAdding }) => {
  const { t } = useTranslation();

  const validationSchema = (t) =>
    Yup.object({
      name: Yup.string()
        .trim()
        .required(t('chatPage.modals.addChannel.form.errors.required'))
        .min(3, t('chatPage.modals.addChannel.form.errors.min'))
        .max(20, t('chatPage.modals.addChannel.form.errors.max')),
    });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onAdd(values.name);
      toast.success(t('chatPage.notifications.channelAdded'));
      onHide();
    } catch (err) {
      toast.error(t('chatPage.notifications.channelAddError'));
      console.error('Add channel failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='add-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.addChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema(t)}
          onSubmit={handleSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <div>
                <Field
                  type='text'
                  name='name'
                  id='name'
                  className={`mb-2 form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  autoFocus
                  disabled={isAdding || isSubmitting}
                  data-testid='add-channel-input'
                />
                <label htmlFor='name' className='visually-hidden'>
                  {t('chatPage.modals.addChannel.form.label')}
                </label>

                {touched.name && errors.name && (
                  <div className='invalid-feedback' style={{ display: 'block' }}>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  className='me-2 btn btn-secondary'
                  onClick={onHide}
                  disabled={isAdding || isSubmitting}
                  data-testid='add-channel-cancel'
                >
                  {t('chatPage.modals.addChannel.cancelButton')}
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={isAdding || isSubmitting || !values.name.trim()}
                  data-testid='add-channel-submit'
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size='sm' animation='border' /> {t('chatPage.modals.addChannel.submittingButton')}
                    </>
                  ) : (
                    t('chatPage.modals.addChannel.submitButton')
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export const RenameChannelModal = ({ show, onHide, onRename, isRenaming, channel }) => {
  const { t } = useTranslation();

  const validationSchema = (t) =>
    Yup.object({
      name: Yup.string()
        .trim()
        .required(t('chatPage.modals.renameChannel.form.errors.required'))
        .min(3, t('chatPage.modals.renameChannel.form.errors.min'))
        .max(20, t('chatPage.modals.renameChannel.form.errors.max')),
    });

  const handleSubmit = async (values, { setSubmitting }) => {
    const trimmed = values.name;
    if (trimmed === channel.name) {
      onHide();
      return;
    }

    try {
      await onRename(channel.id, trimmed);
      toast.success(t('chatPage.notifications.channelRenamed'));
      onHide();
    } catch (err) {
      toast.error(t('chatPage.notifications.channelRenameError'));
      console.error('Rename channel failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered data-testid='rename-channel-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modals.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: channel?.name || '' }}
          validationSchema={validationSchema(t)}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, touched, errors, values }) => (
            <Form>
              <div>
                <Field
                  type='text'
                  name='name'
                  id='renameChannelName'
                  className={`mb-2 form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  autoFocus
                  disabled={isRenaming || isSubmitting}
                  data-testid='rename-channel-input'
                />
                <label htmlFor='renameChannelName' className='visually-hidden'>
                  {t('chatPage.modals.renameChannel.form.label')}
                </label>

                {touched.name && errors.name && (
                  <div className='invalid-feedback' style={{ display: 'block' }}>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  className='me-2 btn btn-secondary'
                  onClick={onHide}
                  disabled={isRenaming || isSubmitting}
                  data-testid='rename-channel-cancel'
                >
                  {t('chatPage.modals.renameChannel.cancelButton')}
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={isRenaming || isSubmitting || !values.name.trim() || values.name.trim() === channel.name}
                  data-testid='rename-channel-submit'
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size='sm' animation='border' /> {t('chatPage.modals.renameChannel.submittingButton')}
                    </>
                  ) : (
                    t('chatPage.modals.renameChannel.submitButton')
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

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
