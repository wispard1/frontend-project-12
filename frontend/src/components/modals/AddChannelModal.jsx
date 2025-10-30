import { Modal, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { cleanText } from '../../utils/profanityFilter'

export const AddChannelModal = ({ show, onHide, onAdd, isAdding }) => {
  const { t } = useTranslation()

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required(t('chatPage.modals.addChannel.form.errors.required'))
      .min(3, t('registerPage.errors.usernameMin'))
      .max(20, t('registerPage.errors.usernameMax')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const filteredName = cleanText(values.name.trim())
      await onAdd(filteredName)
      toast.success(t('chatPage.notifications.channelAdded'))
      onHide()
    }
    catch (err) {
      toast.error(t('chatPage.notifications.channelAddError'))
      console.error('Add channel failed:', err)
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered data-testid="add-channel-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {t('chatPage.modals.addChannel.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                  id="name"
                  className={`mb-2 form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder={t('chatPage.modals.addChannel.form.placeholder')}
                  autoFocus
                  disabled={isAdding || isSubmitting}
                  data-testid="add-channel-input"
                />
                <label htmlFor="name" className="visually-hidden">
                  {t('chatPage.modals.addChannel.form.label')}
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
                  disabled={isAdding || isSubmitting}
                  data-testid="add-channel-cancel"
                >
                  {t('chatPage.modals.addChannel.cancelButton')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isAdding || isSubmitting || !values.name.trim()}
                  data-testid="add-channel-submit"
                >
                  {isSubmitting
                    ? (
                        <>
                          <Spinner size="sm" animation="border" />
                          {' '}
                          {t('chatPage.modals.addChannel.submittingButton')}
                        </>
                      )
                    : t('chatPage.modals.addChannel.submitButton')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}
