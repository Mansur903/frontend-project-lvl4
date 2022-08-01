import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  channels: [],
  messages: [],
  activeChannel: 1,
  authorized: null,
  modal: {
    add: false,
    remove: false,
    rename: false,
  },
  clickedDropdownId: null,
  username: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const newState = state;
      newState.username = action.payload;
    },
    initChannels: (state, action) => {
      const newState = state;
      newState.channels = [...action.payload];
    },
    initMessages: (state, action) => {
      const newState = state;
      newState.messages = [...action.payload];
    },
    chooseChannel: (state, action) => {
      const newState = state;
      newState.activeChannel = action.payload;
    },
    newMessage: (state, action) => {
      const newState = state;
      newState.messages.push(action.payload);
    },
    newChannel: (state, action) => {
      const newState = state;
      newState.channels.push(action.payload);
      const newChannelIndex = newState.channels.length - 1;
      const { id } = newState.channels[newChannelIndex];
      newState.activeChannel = id;
    },
    authError: (state) => {
      const newState = state;
      newState.authorized = false;
    },
    authSuccess: (state) => {
      const newState = state;
      newState.authorized = true;
    },
    openAddModal: (state) => {
      const newState = state;
      newState.modal.add = true;
    },
    openRemoveModal: (state) => {
      const newState = state;
      newState.modal.remove = true;
    },
    openRenameModal: (state) => {
      const newState = state;
      newState.modal.rename = true;
    },
    closeModal: (state) => {
      const newState = state;
      Object.keys(newState.modal).forEach((item) => {
        newState.modal[item] = false;
      });
    },
    setDropdownId: (state, action) => {
      const newState = state;
      newState.clickedDropdownId = action.payload;
    },
    removeChannel: (state, action) => {
      const newState = state;
      const channelId = action.payload;
      newState.channels = newState.channels.filter((c) => c.id !== channelId);
      newState.messages = newState.messages.filter((m) => m.channel !== channelId);
      newState.activeChannel = 1;
    },
    renameChannel: (state, action) => {
      const newState = state;
      const channelId = Number(action.payload.id);
      const channel = newState.channels.find((c) => c.id === channelId);
      if (!channel) return;
      channel.name = action.payload.name;
    },
    setAuthNull: (state) => {
      const newState = state;
      newState.authorized = null;
    },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const {
  initChannels, initMessages, chooseChannel, newMessage, authError, authSuccess, openAddModal,
  closeModal, newChannel, openRemoveModal, setDropdownId, removeChannel, openRenameModal, renameChannel,
  setAuthNull, setUser,
} = chatSlice.actions;

// По умолчанию экспортируется редьюсер сгенерированный слайсом
export default chatSlice.reducer;
