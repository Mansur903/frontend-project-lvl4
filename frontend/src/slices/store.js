import { configureStore, combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './channelsInfo.js';
import messagesReducer from './messagesInfo.js';
import modalReducer from './modal.js';

const rootReducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
});

const initStore = () => configureStore({
  reducer: rootReducer,
});

export default initStore;
