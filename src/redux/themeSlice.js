import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schema: localStorage.getItem('theme') ?? 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.schema = state.schema === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.schema);
    },
    setTheme: (state, action) => {
      state.schema = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
