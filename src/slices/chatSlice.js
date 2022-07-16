import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  channels: [],
  messages: [],
  activeChannel: 1,
  authorized: true,
  modal: {
    opened: false,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initChannels: (state, action) => {
      const newState = state;
      newState.channels = [...action.payload];
      return newState;
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
      console.log('action.payload :', action.payload);
      newState.messages.push(action.payload);
    },

    newChannel: (state, action) => {
      const newState = state;
      newState.channels.push(action.payload);
    },

    authError: (state) => {
      const newState = state;
      newState.authorized = false;
    },

    authSuccess: (state) => {
      const newState = state;
      newState.authorized = true;
    },

    openModal: (state) => {
      const newState = state;
      newState.modal.opened = true;
    },

    closeModal: (state) => {
      const newState = state;
      newState.modal.opened = false;
    },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const {
  initChannels, initMessages, chooseChannel, newMessage, authError, authSuccess, openModal,
  closeModal, newChannel,
} = chatSlice.actions;

// По умолчанию экспортируется редьюсер сгенерированный слайсом
export default chatSlice.reducer;
