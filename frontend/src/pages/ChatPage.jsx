import { useGetChannelsQuery, useGetMessagesQuery } from '../api/chatApi';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChannelsList } from '../components/ChannelsList';
import { MessagesList } from '../components/MessagesList';
import { NewMessagesForm } from '../components/NewMessagesForm';
import { showAddChannelToast, showRenameChannelToast, showRemoveChannelToast } from '../components/toasts/ModalToasts';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChannelHandlers } from '../hooks/useChannelHandlers';
import { cleanText } from '../utils/profanityFilter';
import { chatApi } from '../api/chatApi';

export const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const currentUsername = useSelector((state) => state.auth.user?.username);
  const { currentChannelId } = useSelector((state) => state.channels);

  const {
    handleAddChannel,
    handleRemoveChannel,
    handleRenameChannel,
    isAddingChannel,
    isRemovingChannel,
    isRenamingChannel,
  } = useChannelHandlers();

  const {
    data: channels,
    isLoading: channelsIsLoading,
    error: channelsError,
    refetch: refetchChannels,
  } = useGetChannelsQuery();
  const { data: messages, isLoading: messagesIsLoading, error: messagesError } = useGetMessagesQuery();

  const socketRef = useWebSocket(token);

  useEffect(() => {
    console.log('ChatPage: channels=', channels, 'channelsError=', channelsError);
    if (!channels && !channelsIsLoading && !channelsError) {
      refetchChannels();
    }
  }, [channels, channelsIsLoading, channelsError, refetchChannels]);

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    console.log('Current channel ID:', currentChannelId);
    console.log('Messages:', messages);
    console.log(
      'Filtered messages:',
      messages.filter((msg) => String(msg.channelId) === String(currentChannelId))
    );
    return messages.filter((msg) => String(msg.channelId) === String(currentChannelId));
  }, [messages, currentChannelId]);

  const handleSendMessages = async (messageBody) => {
    if (!messageBody.trim() || !currentChannelId) return;
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    if (!currentUsername) {
      console.error('No currentUsername found in state.auth.user');
      return;
    }

    const filteredMessageBody = cleanText(messageBody.trim());
    const messageData = {
      body: filteredMessageBody,
      channelId: String(currentChannelId),
      username: currentUsername,
    };

    try {
      if (socketRef.current?.connected) {
        console.log('Emitting newMessage via WebSocket:', messageData);
        socketRef.current.emit('newMessage', messageData);
      } else {
        console.log('WebSocket not connected, falling back to HTTP POST:', messageData);
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.post(`${apiUrl}messages`, messageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Message sent via POST:', response.data);
        dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(String(channelId)));
  };

  const handleShowAddChannelModal = () => {
    showAddChannelToast({
      onAdd: handleAddChannel,
      isAdding: isAddingChannel,
      t,
    });
  };

  const handleShowRenameChannelModal = (channelId, channelName) => {
    showRenameChannelToast({
      channel: { id: channelId, name: channelName },
      onRename: handleRenameChannel,
      isRenaming: isRenamingChannel,
      t,
    });
  };

  const handleShowRemoveChannelModal = (channelId, channelName) => {
    showRemoveChannelToast({
      channel: { id: channelId, name: channelName },
      onRemove: handleRemoveChannel,
      isRemoving: isRemovingChannel,
      t,
    });
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

  const defaultChannelId = channels?.[0]?.id || '1';
  if (!currentChannelId && channels?.length > 0) {
    console.log('Setting default channel ID:', defaultChannelId);
    dispatch(setCurrentChannel(String(defaultChannelId)));
  }

  return (
    <div className='d-flex flex-column' style={{ height: '100vh' }}>
      <main className='chat-wrapper flex-grow-1 mt-3 mb-3' style={{ paddingTop: '56px' }}>
        <div className='chat-container mt-3 mb-3' style={{ height: 'calc(100vh - 56px - 40px)' }}>
          <Row className='h-100 flex-md-row g-0'>
            <Col xs={4} md={3} className='border-end bg-light d-flex flex-column h-100'>
              <ChannelsList
                channels={channels ?? [{ id: '1', name: 'general', removable: false }]}
                onChannelClick={handleChannelClick}
                onAddChannelClick={handleShowAddChannelModal}
                onRenameChannelClick={handleShowRenameChannelModal}
                onRemoveChannelClick={handleShowRemoveChannelModal}
              />
            </Col>
            <Col className='p-0 h-100'>
              <div className='d-flex flex-column h-100'>
                <div className='bg-light border-bottom p-3 shadow-sm small'>
                  <p className='m-0'>
                    <b># {channels?.find((c) => String(c.id) === String(currentChannelId))?.name || 'general'}</b>
                  </p>
                  <span className='text-muted'>
                    {t('chatPage.messagesCount', { count: filteredMessages?.length || 0 })}
                  </span>
                </div>
                <MessagesList messages={filteredMessages} currentUsername={currentUsername} />
                <NewMessagesForm onSubmit={handleSendMessages} isConnected={true} />
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};
