import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  type: null,
  channelId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {

    openModal: (state, action) => {
      state.isOpened = true;
      state.type = action.payload.type;
      state.channelId = action.payload.id;
    },
    closeModal: (state) => {
      state.isOpened = false;
      state.type = null;
      state.channelId = null;
    },

  },
});

export const getModalStatus = ({ modal: { isOpened } }) => isOpened;
export const getModalType = ({ modal: { type } }) => type;
export const getDropdownId = ({ modal: { channelId } }) => channelId;

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
