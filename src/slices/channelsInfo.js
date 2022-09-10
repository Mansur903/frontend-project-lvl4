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
      const newState = state;
      newState.channels = [...action.payload];
    },
    chooseChannel: (state, action) => {
      const newState = state;
      newState.activeChannel = action.payload;
    },
    newChannel: (state, action) => {
      const newState = state;
      newState.channels.push(action.payload);
    },
    setActiveChannel: (state, action) => {
      const newState = state;
      newState.activeChannel = action.payload;
    },
    removeChannel: (state, action) => {
      const newState = state;
      const channelId = action.payload;
      newState.channels = newState.channels.filter((c) => c.id !== channelId);
      newState.activeChannel = 1;
    },
    renameChannel: (state, action) => {
      const newState = state;
      const channelId = Number(action.payload.id);
      const channel = newState.channels.find((c) => c.id === channelId);
      if (!channel) return;
      channel.name = action.payload.name;
    },
  },
});

export const channelsActions = channelsSlice.actions;

export default channelsSlice.reducer;
