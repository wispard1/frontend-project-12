import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { chatApi } from '../api/chatApi';
import channelsReducer from './channelsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    [chatApi.reducerPath]: chatApi.reducer, 
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(chatApi.middleware)
});
