import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  add: false,
  remove: false,
  rename: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAddModal: (state) => {
      const newState = state;
      newState.add = true;
    },
    openRemoveModal: (state) => {
      const newState = state;
      newState.remove = true;
    },
    openRenameModal: (state) => {
      const newState = state;
      newState.rename = true;
    },
    closeModal: (state) => {
      const newState = state;
      Object.keys(newState).forEach((item) => {
        newState[item] = false;
      });
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
