import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      console.log('Токен, полученный в prepareHeaders:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        
        console.log('Заголовок Authorization установлен');
      }
      return headers;
    },
  }),
  tagTypes: ['Channel', 'Message'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: (result) => [
        { type: 'Channel', id: 'LIST' },
        ...(result ? result.map((channel) => ({ type: 'Channel', id: channel.id })) : []),
      ],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: (result) => [
        { type: 'Message', id: 'LIST' },
        ...(result ? result.map((message) => ({ type: 'Message', id: message.id })) : []),
      ],
    }),
    getChannel: builder.query({
      query: (id) => `/channels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Channel', id }],
    }),
    getMessage: builder.query({
      query: (id) => `/messages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Message', id }],
    }),
    addChannel: builder.mutation({
      query: (newChannelData) => ({
        url: '/channels',
        method: 'POST',
        body: newChannelData,
      }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),
    removeChannel: builder.mutation({
      query: (channelId) => ({
        url: `/channels/${channelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, channelId) => [
        { type: 'Channel', id: 'LIST' },
        { type: 'Channel', id: channelId },
      ],
    }),
    renameChannel: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Channel', id: 'LIST' },
        { type: 'Channel', id },
      ],
    }),
    addMessage: builder.mutation({
      query: (newMessageData) => ({
        url: `/messages`,
        method: 'POST',
        body: newMessageData,
      }),
      invalidatesTags: (result) => [
        { type: 'Message', id: 'LIST' },
        { type: 'Message', id: result?.id },
      ],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetMessagesQuery,
  useGetChannelQuery,
  useGetMessageQuery,
  useAddChannelMutation,
  useRemoveChannelMutation,
  useRenameChannelMutation,
  useAddMessageMutation,
  useSignupMutation,
  useLoginMutation,
} = chatApi;
