import { useMemo, useState, useEffect } from 'react'
import { Col, Spinner, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useGetChannelsQuery, useGetMessagesQuery, useAddMessageMutation, chatApi } from '../api/chatApi'
import { setCurrentChannel } from '../store/channelsSlice'
import { ChannelsList } from '../components/ChannelsList'
import { MessagesList } from '../components/MessagesList'
import { NewMessagesForm } from '../components/NewMessagesForm'
import { useChannelHandlers } from '../hooks/useChannelHandlers'
import { useWebSocket } from '../hooks/useWebSocket'
import { useChannelModals } from '../components/modals/useChannelModals'
import { cleanText } from '../utils/profanityFilter'

export const ChatPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const token = localStorage.getItem('token')
  const currentUsername = useSelector(state => state.auth.user?.username)
  const { currentChannelId } = useSelector(state => state.channels)

  const {
    handleAddChannel,
    handleRemoveChannel,
    handleRenameChannel,
    isAddingChannel,
    isRemovingChannel,
    isRenamingChannel,
  } = useChannelHandlers()

  const { data: channels, isLoading: channelsIsLoading, error: channelsError } = useGetChannelsQuery()
  const { data: messages, isLoading: messagesIsLoading, error: messagesError } = useGetMessagesQuery()
  const [addMessage] = useAddMessageMutation()

  const socketRef = useWebSocket(token)
  const [isConnected, setIsConnected] = useState(true)

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
    }
  }, [socketRef])

  const displayChannels = useMemo(() => {
    if (!channels || channels.length === 0) {
      return [{ id: '1', name: 'general', removable: false }]
    }
    return channels;
  }, [channels])

  useEffect(() => {
    if (!currentChannelId && displayChannels.length > 0) {
      dispatch(setCurrentChannel(displayChannels[0].id))
    }
  }, [currentChannelId, displayChannels, dispatch])

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter(msg => msg.channelId === currentChannelId);
  }, [messages, currentChannelId])

  const handleSendMessages = async (messageBody) => {
    if (!messageBody.trim() || !currentChannelId || !currentUsername) return;

    const filteredBody = cleanText(messageBody.trim());
    const messageData = {
      body: filteredBody,
      channelId: currentChannelId,
      username: currentUsername,
    }

    try {
      await addMessage(messageData).unwrap();
      if (!isConnected) {
        dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]))
      }
    } 
    catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleChannelClick = id => dispatch(setCurrentChannel(id))

  const { showAddModal, showRenameModal, showRemoveModal, Modals } = useChannelModals({
    onAdd: handleAddChannel,
    onRename: handleRenameChannel,
    onRemove: handleRemoveChannel,
    isAdding: isAddingChannel,
    isRenaming: isRenamingChannel,
    isRemoving: isRemovingChannel,
  })

  if (channelsIsLoading || messagesIsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation='border' />
      </div>
    )
  }

  if (channelsError || messagesError) {
    return (
      <div className="container mt-5">
        <Alert variant='danger'>
          Ошибка: {channelsError?.data?.message || messagesError?.data?.message || 'Неизвестная ошибка'}
        </Alert>
      </div>
    )
  }
  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <main className="flex-grow-1 py-3 pt-5">
        <div className="container-xl mx-auto h-100 pt-4">
          <div className="row justify-content-center h-100">
            <div className="col-xxl-10 col-xl-11 col-12 h-100">
              <div className="d-flex flex-row bg-white rounded shadow" style={{ height: '1050px' }}>
                <Col xs={4} md={3} className="border-end bg-light h-100">
                  <ChannelsList
                    channels={displayChannels}
                    onChannelClick={handleChannelClick}
                    onAddChannelClick={showAddModal}
                    onRenameChannelClick={(id, name) => showRenameModal({ id, name })}
                    onRemoveChannelClick={(id, name) => showRemoveModal({ id, name })}
                  />
                </Col>
                <Col className="d-flex flex-column h-100">
                  <div className="border-bottom p-3 bg-white">
                    <p className="m-0">
                      <b>
                        #
                        {channels?.find(c => c.id === currentChannelId)?.name || 'general'}</b>
                    </p>
                    <span className="text-muted">
                      {t('chatPage.messagesCount', { count: filteredMessages?.length || 0 })}
                    </span>
                    {!isConnected && (
                      <div className="text-danger small mt-1">{t('chatPage.notifications.websocketDisconnected')}</div>
                    )}
                  </div>
                  <MessagesList messages={filteredMessages} currentUsername={currentUsername} />
                  <NewMessagesForm onSubmit={handleSendMessages} isConnected={isConnected} />
                </Col>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modals />
    </div>
  )
}
