// src/pages/chatPage.jsx
import { useGetChannelsQuery, useGetMessagesQuery } from '../api/chatApi';
import { Row, Col, Form, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { chatApi } from '../api/chatApi';
import axios from 'axios';

export const ChatPage = () => {
  const dispatch = useDispatch();

  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const currentUsername = useSelector((state) => state.auth.user?.username);

  const { data: messages, isLoading: messagesIsLoading, error: messagesError } = useGetMessagesQuery();
  const { isLoading: channelsIsLoading, error: channelsError } = useGetChannelsQuery();

  const [newMessageBody, setNewMessageBody] = useState('');

  const socketRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('No token found, cannot connect to WebSocket');
      return;
    }

    socketRef.current = io('http://localhost:5002', {
      auth: {
        token,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
    });

    socketRef.current.on('newMessage', (newMessageData) => {
      console.log('Received new message via WebSocket:', newMessageData);
      dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
    });

    socketRef.current.on('newChannel', (newChannelData) => {
      console.log('Received new channel via WebSocket:', newChannelData);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    socketRef.current.on('removeChannel', (removeChannelPayload) => {
      console.log('Received remove channel via WebSocket:', removeChannelPayload);
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ])
      );
    });

    socketRef.current.on('renameChannel', (renameChannelPayload) => {
      console.log('Received rename channel via WebSocket:', renameChannelPayload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage'),
          socketRef.current.off('newChannel'),
          socketRef.current.off('removeChannel'),
          socketRef.current.off('renameChannel');
        socketRef.current.disconnect();
      }
    };
  }, [token, dispatch]);

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter((msg) => msg.channelId === currentChannelId);
  }, [messages, currentChannelId]);

  const handleSendMessages = async (e) => {
    e.preventDefault();

    if (newMessageBody.trim() && socketRef.current && socketRef.current.connected) {
      const messageData = {
        body: newMessageBody.trim(),
        channelId: currentChannelId,
        username: currentUsername,
      };

      console.log('Sending message via POST:', messageData);

      try {
        const response = await axios.post('/api/v1/messages', messageData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Message sent via POST successfully, response:', response.data);
        setNewMessageBody('');
      } catch (error) {
        console.error('Error sending message via POST:', error);
      }
    }
  };

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

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
      {/* Контейнер чата */}
      <main className='chat-wrapper flex-grow-1 mt-5 mb-1'>
        <div className='chat-container mt-3 mb-3' style={{ height: 'calc(100vh - 56px - 40px)' }}>
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
                  <ListGroup.Item
                    key={channel.id}
                    className={`w-100 rounded-0 text-start ${channel.id === currentChannelId ? 'active' : ''}`}
                    action
                    variant='light'
                    onClick={() => handleChannelClick(channel.id)}
                  >
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
                    <b># {channels?.find((c) => c.id === currentChannelId)?.name || 'general'}</b>
                  </p>
                  <span className='text-muted'>{filteredMessages?.length || 0} сообщений</span>
                </div>

                <div id='messages-box' className='chat-messages overflow-auto px-4 flex-grow-1'>
                  {filteredMessages?.map((message) => {
                    const isOwnMessage = message.username === currentUsername;

                    return (
                      <div key={message.id} className={isOwnMessage ? 'own-message' : 'other-message'}>
                        <div className='message-content'>
                          <b>{message.username || 'Аноним'}:</b> {message.body}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='mt-auto px-4 py-3 border-top bg-white'>
                  <Form onSubmit={handleSendMessages} className='py-1 border rounded-2 pt-0 pb-0'>
                    <div className='input-group has-validation'>
                      <Form.Control
                        type='text'
                        name='body'
                        placeholder='Введите сообщение...'
                        aria-label='Новое сообщение'
                        className='border-0 p-0 ps-2'
                        value={newMessageBody}
                        onChange={(e) => setNewMessageBody(e.target.value)}
                      />
                      <Button type='submit' variant='light' disabled={!socketRef.current?.connected}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 16 16'
                          width='20'
                          height='20'
                          fill='#6c757d'
                          className='bi bi-arrow-right-square'
                        >
                          <path
                            fillRule='evenodd'
                            d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z'
                          ></path>
                        </svg>
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
