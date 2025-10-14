import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { chatApi } from '../api/chatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [chatApi.reducerPath]: chatApi.reducer, 
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(chatApi.middleware)
});
