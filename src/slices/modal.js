import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  add: false,
  remove: false,
  rename: false,
  channelId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.add = true;
    },
    openRemoveModal: (state, action) => {
      state.remove = true;
      state.channelId = action.payload;
    },
    openRenameModal: (state, action) => {
      console.log('action :', action);
      state.rename = true;
      state.channelId = action.payload;
    },
    closeModal: (state) => {
      Object.keys(state).forEach((item) => {
        state[item] = false;
      });
    },
  },
});

export const getModalAdd = ({ modal: { add } }) => add;
export const getModalRemove = ({ modal: { remove } }) => remove;
export const getModalRename = ({ modal: { rename } }) => rename;
export const getDropdownId = ({ modal: { channelId } }) => channelId;

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
