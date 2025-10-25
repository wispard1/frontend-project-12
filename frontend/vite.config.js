import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      // Проксируем запросы к API
      '/api/v1': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // Проксируем WebSocket соединения
      '/socket.io': {
        target: 'ws://localhost:5001',
        ws: true,
      },
    },
  },
  preview: {
    port: 10000,
    proxy: {
      '/api/v1': {
        target: 'https://frontend-project-12-rit5.onrender.com/',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'wss://frontend-project-12-rit5.onrender.com/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
