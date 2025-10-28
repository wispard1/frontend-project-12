import { useMemo, useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetChannelsQuery, useGetMessagesQuery, useAddMessageMutation, chatApi } from '../api/chatApi';
import { setCurrentChannel } from '../store/channelsSlice';
import { ChannelsList } from '../components/ChannelsList';
import { MessagesList } from '../components/MessagesList';
import { NewMessagesForm } from '../components/NewMessagesForm';
import { showAddChannelToast, showRenameChannelToast, showRemoveChannelToast } from '../components/toasts/ModalToasts';
import { useChannelHandlers } from '../hooks/useChannelHandlers';
import { useWebSocket } from '../hooks/useWebSocket';
import { cleanText } from '../utils/profanityFilter';

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

  const { data: channels, isLoading: channelsIsLoading, error: channelsError } = useGetChannelsQuery();
  const { data: messages, isLoading: messagesIsLoading, error: messagesError } = useGetMessagesQuery();
  const [addMessage] = useAddMessageMutation();

  const socketRef = useWebSocket(token);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socketRef]);

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter((msg) => String(msg.channelId) === String(currentChannelId));
  }, [messages, currentChannelId]);

  const handleSendMessages = async (messageBody) => {
    if (!messageBody.trim() || !currentChannelId || !currentUsername) return;

    const filteredBody = cleanText(messageBody.trim());
    const messageData = {
      body: filteredBody,
      channelId: String(currentChannelId),
      username: currentUsername,
    };

    try {
      await addMessage(messageData).unwrap();
      console.log('✅ Message sent via HTTP');

      if (!isConnected) {
        console.log('⚠️ Offline mode — forcing message refetch');
        dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  };

  const handleChannelClick = (id) => dispatch(setCurrentChannel(String(id)));

  const handleShowAddChannelModal = () => {
    showAddChannelToast({
      onAdd: handleAddChannel,
      isAdding: isAddingChannel,
      t,
    });
  };

  const handleShowRenameChannelModal = (id, name) => {
    showRenameChannelToast({
      channel: { id, name },
      onRename: handleRenameChannel,
      isRenaming: isRenamingChannel,
      t,
    });
  };

  const handleShowRemoveChannelModal = (id, name) => {
    showRemoveChannelToast({
      channel: { id, name },
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

  // const defaultChannelId = channels?.[0]?.id || '1';
  // if (!currentChannelId && channels?.length > 0) {
  //   dispatch(setCurrentChannel(String(defaultChannelId)));
  // }

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
                    <b>#{channels?.find((c) => String(c.id) === String(currentChannelId))?.name || 'general'}</b>
                  </p>
                  <span className='text-muted'>
                    {t('chatPage.messagesCount', {
                      count: filteredMessages?.length || 0,
                    })}
                  </span>
                  {!isConnected && <div className='text-danger small mt-1'>{t('chatPage.offline')}</div>}
                </div>
                <MessagesList messages={filteredMessages} currentUsername={currentUsername} />
                <NewMessagesForm onSubmit={handleSendMessages} isConnected={isConnected} />
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};
