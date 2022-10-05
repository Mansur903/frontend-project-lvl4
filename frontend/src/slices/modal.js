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
      state.isOpened = true; // eslint-disable-line no-param-reassign
      state.type = action.payload.type; // eslint-disable-line no-param-reassign
      state.channelId = action.payload.id; // eslint-disable-line no-param-reassign
    },
    closeModal: (state) => {
      state.isOpened = false; // eslint-disable-line no-param-reassign
      state.type = null; // eslint-disable-line no-param-reassign
      state.channelId = null; // eslint-disable-line no-param-reassign
    },

  },
});

export const getModalStatus = ({ modal: { isOpened } }) => isOpened;
export const getModalType = ({ modal: { type } }) => type;
export const getDropdownId = ({ modal: { channelId } }) => channelId;

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
