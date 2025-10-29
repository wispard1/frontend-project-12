// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { chatApi } from '../api/chatApi';

export const useWebSocket = (token) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io('/socket.io', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket via proxy');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    socket.on('newMessage', (payload) => {
      console.log('newMessage:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
    });

    socket.on('newChannel', (payload) => {
      console.log('newChannel:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    socket.on('removeChannel', (payload) => {
      console.log('removeChannel:', payload);
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ])
      );
    });

    socket.on('renameChannel', (payload) => {
      console.log('renameChannel:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, dispatch]);

  return socketRef;
};
