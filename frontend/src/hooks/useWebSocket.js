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

    socketRef.current = io('http://localhost:5002', {
      auth: { token },
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
        socketRef.current.off('newMessage');
        socketRef.current.off('newChannel');
        socketRef.current.off('removeChannel');
        socketRef.current.off('renameChannel');
        socketRef.current.disconnect();
      }
    };
  }, [token, dispatch]);

  return socketRef;
};
