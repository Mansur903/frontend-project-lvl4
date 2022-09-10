import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clickedDropdownId: null,
};

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    setDropdownId: (state, action) => {
      const newState = state;
      newState.clickedDropdownId = action.payload;
    },
  },
});

export const dropdownActions = dropdownSlice.actions;

export default dropdownSlice.reducer;
