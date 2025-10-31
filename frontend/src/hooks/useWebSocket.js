import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { chatApi } from '../api/chatApi'

export const useWebSocket = (token) => {
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!token) return

    const wsURL = window.location.origin.replace(/^http/, 'ws')

    const socket = io(wsURL, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
    })

    socket.on('disconnect', () => {
    })

    socket.on('newMessage', () => {
      dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]))
    })

    socket.on('newChannel', () => {
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]))
    })

    socket.on('removeChannel', () => {
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ]),
      )
    })

    socket.on('renameChannel', () => {
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, dispatch])

  return socketRef
}
