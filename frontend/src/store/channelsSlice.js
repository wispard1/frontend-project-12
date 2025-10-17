import { createSlice } from '@reduxjs/toolkit';
import { chatApi } from '../api/chatApi';

const initialState = {
  channels: [],
  currentChannelId: '1',
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(chatApi.endpoints.getChannels.matchFulfilled, (state, { payload }) => {
      state.channels = payload;
    });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
