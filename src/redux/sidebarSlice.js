import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: JSON.parse(localStorage.getItem('sidebarStatus')),
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleIsOpen: (state) => {
      state.isOpen = !state.isOpen;
      localStorage.setItem('sidebarStatus', state.isOpen);
    },
  },
});

export const { toggleIsOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
