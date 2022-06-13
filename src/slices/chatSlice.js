import { createSlice } from '@reduxjs/toolkit';

// Начальное значение
const initialState = {
  channels: [],
  messages: [],
  activeChannel: '1',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
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
      console.log('action.payload :', action.payload);
      newState.messages.push(action.payload);
    },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const {
  initChannels, initMessages, chooseChannel, newMessage,
} = chatSlice.actions;

// По умолчанию экспортируется редьюсер сгенерированный слайсом
export default chatSlice.reducer;
