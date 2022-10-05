import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const defaultChannelNumber = 1;

const initialState = {
  channels: [],
  activeChannel: defaultChannelNumber,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    initChannels: (state, action) => {
      state.channels = action.payload.channels; // eslint-disable-line no-param-reassign
    },
    chooseChannel: (state, action) => {
      state.activeChannel = action.payload; // eslint-disable-line no-param-reassign
    },
    newChannel: (state, action) => {
      state.channels.push(action.payload);
      state.activeChannel = action.payload.id; // eslint-disable-line no-param-reassign
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload; // eslint-disable-line no-param-reassign
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;
      _.remove(state.channels, (channel) => channel.id === channelId);
      if (state.activeChannel === channelId) {
        state.activeChannel = 1; // eslint-disable-line no-param-reassign
      }
    },
    renameChannel: (state, action) => {
      const channelId = action.payload.id;
      const channel = state.channels.find((c) => c.id === channelId);
      channel.name = action.payload.name;
    },
  },
});

export const getActiveChannel = ({ channels: { activeChannel } }) => activeChannel;
export const getChannels = ({ channels: { channels } }) => channels;

export const channelsActions = channelsSlice.actions;

export default channelsSlice.reducer;
