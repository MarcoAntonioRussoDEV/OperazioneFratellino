import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { AUTH_DATA, USER_DATA } from '@/config/links/urls';

export const getAuthUser = createAsyncThunk('user/getAuthUser', async () => {
  const response = await axios.get(AUTH_DATA.getUser);
  response.data = {
    ...response.data,
    avatar: USER_DATA.getAvatar + response.data.email,
  };
  return response.data;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await axios.post(AUTH_DATA.logout);
  return response.data;
});
export const loginUser = createAsyncThunk('user/loginUser', async () => {
  const response = await axios.post(AUTH_DATA.login);
  return response.data;
});

const user = {
  name: 'Anonimous',
  email: '',
  role: '',
  city: '',
  avatar: '',
};

const initialState = {
  user,
  status: 'idle',
  error: null,
  response: null,
  isAuthenticated: localStorage.getItem('isAuthenticated') ?? false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetStatus(state) {
      (state.user = user), (state.status = 'idle'), (state.error = null);
      state.response = null;
      state.isAuthenticated = localStorage.getItem('isAuthenticated') ?? false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = user;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;
