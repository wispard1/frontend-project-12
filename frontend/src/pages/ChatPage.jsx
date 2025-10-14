// src/pages/chatPage.jsx
import { Navbar } from '../components/Navbar';
import { useGetChannelsQuery, useGetMessagesQuery } from '../api/chatApi';
import { Row, Col, Form, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';

export const ChatPage = () => {
  const { data: channels, isLoading: channelsIsLoading, error: channelsError } = useGetChannelsQuery();
  const { data: messages, isLoading: messagesIsLoading, error: messagesError } = useGetMessagesQuery();

  const result = useGetChannelsQuery();
  console.log('Full result from useGetChannelsQuery:', result);

  if (channelsIsLoading || messagesIsLoading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
        <Spinner animation='border' />
      </div>
    );
  }

  if (channelsError || messagesError) {
    return (
      <div className='container mt-5'>
        <Alert variant='danger'>
          Ошибка: {channelsError?.data?.message || messagesError?.data?.message || 'Неизвестная ошибка'}
        </Alert>
      </div>
    );
  }

  return (
    <div className='d-flex flex-column' style={{ height: '100vh' }}>
      <Navbar />
      {/* Контейнер чата */}
      <main className='chat-wrapper flex-grow-1 mt-3 mb-3'>
        <div className='chat-container' style={{ height: 'calc(100vh - 56px - 40px)' }}>
          <Row className='h-100 flex-md-row g-0'>
            {/* Левая колонка — список каналов */}
            <Col xs={4} md={3} className='border-end bg-light d-flex flex-column h-100'>
              <div className='d-flex justify-content-between align-items-center px-3 py-2 border-bottom'>
                <b>Каналы</b>
                <Button variant='link' className='p-0 text-primary'>
                  <i className='bi bi-plus-square' />
                </Button>
              </div>
              <ListGroup className='overflow-auto px-2 py-2 flex-grow-1'>
                {channels?.map((channel) => (
                  <ListGroup.Item key={channel.id} className='w-100 rounded-0 text-start' action variant='light'>
                    <span className='me-1'>#</span>
                    {channel.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            {/* Правая колонка — чат */}
            <Col className='p-0 h-100'>
              <div className='d-flex flex-column h-100'>
                <div className='bg-light border-bottom p-3 shadow-sm small'>
                  <p className='m-0'>
                    <b># general</b>
                  </p>
                  <span className='text-muted'>{messages?.length || 0} сообщений</span>
                </div>

                <div id='messages-box' className='chat-messages overflow-auto px-4 flex-grow-1'>
                  {messages?.map((message) => (
                    <div key={message.id} className='mb-2'>
                      <b>{message.user?.username || 'Аноним'}</b>: {message.body}
                    </div>
                  ))}
                </div>

                <div className='mt-auto px-4 py-3 border-top bg-white'>
                  <Form className='py-1 border rounded-2'>
                    <div className='input-group has-validation'>
                      <Form.Control
                        type='text'
                        name='body'
                        placeholder='Введите сообщение...'
                        aria-label='Новое сообщение'
                        className='border-0 p-0 ps-2'
                      />
                      <Button type='submit' variant='light' className='btn btn-group-vertical'>
                        <i className='bi bi-arrow-right-square' />
                        <span className='visually-hidden'>Отправить</span>
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};
