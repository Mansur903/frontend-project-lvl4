import _ from 'lodash';

import { createSlice } from '@reduxjs/toolkit';
import { channelsActions } from './channelsInfo.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    newMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      _.remove(state.messages, (channel) => channel.id === channelId);
    })
      .addCase(channelsActions.initChannels, (state, action) => {
        state.messages = action.payload.messages;
      });
  },
});

export const getMessagesById = (id) => ({ messages: { messages } }) => messages.filter((item) => item.channel === id);

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
