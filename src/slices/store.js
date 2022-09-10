import { configureStore, combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './channelsInfo.js';
import messagesReducer from './messagesInfo.js';
import modalReducer from './modal.js';
import dropdownReducer from './dropdown.js';

const rootReducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modal: modalReducer,
  dropdown: dropdownReducer,
});

export const initStore = () => configureStore({
  reducer: rootReducer,
});

export default configureStore({
  reducer: rootReducer,
});
