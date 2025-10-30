import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_BASE_URL = '/api/v1'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Channel', 'Message'],
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: userData => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
    }),

    getChannels: builder.query({
      query: () => 'channels',
      providesTags: result =>
        result ?
          [...result.map(({ id }) => ({ type: 'Channel', id })), { type: 'Channel', id: 'LIST' }] :
          [{ type: 'Channel', id: 'LIST' }],
    }),

    addChannel: builder.mutation({
      query: newChannel => ({
        url: 'channels',
        method: 'POST',
        body: newChannel,
      }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),

    removeChannel: builder.mutation({
      query: id => ({
        url: `channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Channel', id: 'LIST' }],
    }),

    getMessages: builder.query({
      query: () => 'messages',
      providesTags: result =>
        result ?
          [...result.map(({ id }) => ({ type: 'Message', id })), { type: 'Message', id: 'LIST' }] :
          [{ type: 'Message', id: 'LIST' }],
    }),

    addMessage: builder.mutation({
      query: newMessage => ({
        url: 'messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useGetChannelsQuery,
  useAddChannelMutation,
  useRenameChannelMutation,
  useRemoveChannelMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
} = chatApi
