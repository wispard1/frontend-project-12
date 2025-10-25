import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { chatApi } from '../api/chatApi';

let socketInstance = null;

export const useWebSocket = (token) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketInstance = io('http://localhost:5001', {
      auth: { token },
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
    });

    socketInstance.on('newMessage', (payload) => {
      console.log('Received newMessage via WebSocket:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Message', id: 'LIST' }]));
    });

    socketInstance.on('newChannel', (payload) => {
      console.log('Received newChannel via WebSocket:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    socketInstance.on('removeChannel', (payload) => {
      console.log('Received removeChannel via WebSocket:', payload);
      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Channel', id: 'LIST' },
          { type: 'Message', id: 'LIST' },
        ])
      );
    });

    socketInstance.on('renameChannel', (payload) => {
      console.log('Received renameChannel via WebSocket:', payload);
      dispatch(chatApi.util.invalidateTags([{ type: 'Channel', id: 'LIST' }]));
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        socketRef.current = null;
      }
    };
  }, [token, dispatch]);

  return socketRef;
};
