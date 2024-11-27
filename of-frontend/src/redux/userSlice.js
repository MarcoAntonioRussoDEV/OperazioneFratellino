import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { USER_DATA } from '@/config/links/urls';

export const getAuthUser = createAsyncThunk('user/getAuthUser', async () => {
  const response = await axios.get('/api/auth/me');
  response.data = {
    ...response.data,
    avatar: USER_DATA.getAvatar + response.data.email,
  };
  return response.data;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await axios.post('/api/auth/logout');
  return response.data;
});
export const loginUser = createAsyncThunk('user/loginUser', async () => {
  const response = await axios.post('/api/auth/login');
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
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetStatus(state) {
      (state.user = user), (state.status = 'idle'), (state.error = null);
      state.response = null;
      state.isAuthenticated = false;
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
