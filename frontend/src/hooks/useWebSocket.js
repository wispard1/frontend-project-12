import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { chatApi } from '../api/chatApi';

export const useWebSocket = (token) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const wsURL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;

    console.log('Connecting WebSocket to:', wsURL);

    const socket = io(wsURL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from WebSocket server:', reason);
    });

    socket.on('newMessage', (payload) => {
      console.log('📩 Received newMessage:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
    });

    socket.on('newChannel', (payload) => {
      console.log('Received newChannel via WebSocket:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    socket.on('removeChannel', (payload) => {
      console.log('🗑️ Received removeChannel:', payload);
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ])
      );
    });

    socket.on('renameChannel', (payload) => {
      console.log('✏️ Received renameChannel:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      console.log('WebSocket connection closed');
    };
  }, [token, dispatch]);

  return socketRef;
};
