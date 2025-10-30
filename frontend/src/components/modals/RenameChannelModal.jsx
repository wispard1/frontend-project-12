import { Modal, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { cleanText } from '../../utils/profanityFilter'

export const RenameChannelModal = ({ show, onHide, onRename, isRenaming, channel }) => {
  const { t } = useTranslation()

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required(t('chatPage.modals.renameChannel.form.errors.required'))
      .min(3, t('registerPage.errors.usernameMin'))
      .max(20, t('registerPage.errors.usernameMax')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    const filteredName = cleanText(values.name.trim())

    if (filteredName === channel?.name) {
      onHide()
      return
    }

    try {
      await onRename(channel.id, filteredName)
      toast.success(t('chatPage.notifications.channelRenamed'))
      onHide()
    }
    catch (err) {
      toast.error(t('chatPage.notifications.channelRenameError'))
      console.error('Rename channel failed:', err)
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered data-testid="rename-channel-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {t('chatPage.modals.renameChannel.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: channel?.name || '' }}
          validationSchema={validationSchema}
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
                  type="text"
                  name="name"
                  id="renameChannelName"
                  className={`mb-2 form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder={t('chatPage.modals.renameChannel.form.placeholder')}
                  autoFocus
                  disabled={isRenaming || isSubmitting}
                  data-testid="rename-channel-input"
                />
                <label htmlFor="renameChannelName" className="visually-hidden">
                  {t('chatPage.modals.renameChannel.form.label')}
                </label>

                {touched.name && errors.name && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="me-2 btn btn-secondary"
                  onClick={onHide}
                  disabled={isRenaming || isSubmitting}
                  data-testid="rename-channel-cancel"
                >
                  {t('chatPage.modals.renameChannel.cancelButton')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isRenaming
                    || isSubmitting
                    || !values.name.trim()
                    || values.name.trim() === channel?.name
                  }
                  data-testid="rename-channel-submit"
                >
                  {isSubmitting
                    ? (
                        <>
                          <Spinner size="sm" animation="border" />
                          {' '}
                          {t('chatPage.modals.renameChannel.submittingButton')}
                        </>
                      )
                    : t('chatPage.modals.renameChannel.submitButton')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}
