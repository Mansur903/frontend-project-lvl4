import { createSlice } from '@reduxjs/toolkit';
import { channelsActions } from './channelsInfo.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    initMessages: (state, action) => {
      const newState = state;
      newState.messages = [...action.payload];
    },
    newMessage: (state, action) => {
      const newState = state;
      newState.messages.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const newState = state;
      const channelId = action.payload;
      newState.messages = newState.messages.filter((m) => m.channel !== channelId);
    });
  },
});

export const getMessagesById = (id) => ({ messages: { messages } }) => messages.filter((item) => item.channel === Number(id));

export const messagesActions = messagesSlice.actions;

export default messagesSlice.reducer;
