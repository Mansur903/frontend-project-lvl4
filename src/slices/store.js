import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice.js';

export default configureStore({
  reducer: {
    // chat – имя внутри объекта состояния state.counter
    chat: chatReducer,
  },
});
