import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const NewMessagesForm = ({ onSubmit }) => {
  const [newMessageBody, setNewMessageBody] = useState('')
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('NewMessagesForm submitting:', newMessageBody)
    if (newMessageBody.trim()) {
      onSubmit(newMessageBody.trim())
      setNewMessageBody('')
    }
  }

  return (
    <div className="mt-auto px-4 py-3 border-top bg-white">
      <Form onSubmit={handleSubmit} className="py-1 border rounded-2 pt-0 pb-0">
        <div className="input-group has-validation">
          <Form.Control
            type="text"
            name="body"
            placeholder={t('chatPage.messagesInputPlaceholder')}
            aria-label={t('chatPage.messagesNew')}
            className="border-0 p-0 ps-2"
            value={newMessageBody}
            onChange={(e) => setNewMessageBody(e.target.value)}
            autoComplete="off"
            data-testid="new-message-input"
          />
          <Button type="submit" variant="light" disabled={!newMessageBody.trim()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="#6c757d"
              className="bi bi-arrow-right-square"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
              ></path>
            </svg>
            <span className="visually-hidden">{t('chatPage.sendMessageButton')}</span>
          </Button>
        </div>
      </Form>
    </div>
  )
}
