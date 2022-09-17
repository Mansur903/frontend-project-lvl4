import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    initChannels: (state, action) => {
      state.channels = [...action.payload];
    },
    chooseChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
    newChannel: (state, action) => {
      state.channels.push(action.payload);
      state.activeChannel = action.payload.id;
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;
      state.channels = state.channels.filter((c) => c.id !== channelId);
      state.activeChannel = 1;
    },
    renameChannel: (state, action) => {
      const channelId = Number(action.payload.id);
      const channel = state.channels.find((c) => c.id === channelId);
      if (!channel) return;
      channel.name = action.payload.name;
    },
  },
});

export const getActiveChannel = ({ channels: { activeChannel } }) => activeChannel;
export const getChannels = ({ channels: { channels } }) => channels;

export const channelsActions = channelsSlice.actions;

export default channelsSlice.reducer;
