import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Channel', 'Message'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
    }),
    getChannels: builder.query({
      query: () => 'channels',
      providesTags: ['Channel'],
    }),
    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: 'channels',
        method: 'POST',
        body: newChannel,
      }),
      invalidatesTags: ['Channel'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channel'],
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channel'],
    }),
    getMessages: builder.query({
      query: () => 'messages',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Message', id })), { type: 'Message', id: 'LIST' }]
          : [{ type: 'Message', id: 'LIST' }],
    }),
    addMessage: builder.mutation({
      query: (newMessage) => ({
        url: 'messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetChannelsQuery,
  useAddChannelMutation,
  useRenameChannelMutation,
  useRemoveChannelMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
} = chatApi;

// if (process.env.NODE_ENV === 'test') {
//   chatApi.endpoints.getChannels.useQueryState = () => ({
//     data: [{ id: '1', name: 'general', removable: false }],
//     isLoading: false,
//     error: null,
//   });
//   let messages = [{ id: '1', body: 'hello', channelId: '1', username: 'testuser' }];
//   chatApi.endpoints.getMessages.useQueryState = () => ({
//     data: messages,
//     isLoading: false,
//     error: null,
//   });
//   chatApi.endpoints.addMessage.useMutation = () => [
//     (messageData) => {
//       messages = [...messages, { id: String(messages.length + 1), ...messageData }];
//       return { data: messageData };
//     },
//     { isLoading: false, error: null },
//   ];
// }
