import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { AUTH_DATA } from '@/config/links/urls';
import { blobToSrc, createInitialsImage } from '@/utils/imageUtils';
import { usernameInitials } from '@/utils/formatUtils';

export const getAuthUser = createAsyncThunk('user/getAuthUser', async () => {
  const response = await axios.get(AUTH_DATA.getUser);

  let avatar = response.data.avatar;
  if (!response.data.avatar) {
    avatar = createInitialsImage(usernameInitials(response.data.name));
  }
  response.data = {
    ...response.data,
    avatar: blobToSrc(avatar),
  };
  return response.data;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await axios.post(AUTH_DATA.logout);
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
  window.location.pathname = '/login';
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

const resetUserStatus = (state) => {
  state.user = user;
  state.status = 'idle';
  state.error = null;
  state.response = null;
  state.isAuthenticated = false;
  localStorage.removeItem('isAuthenticated');
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
      resetStatus(state);
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
        resetUserStatus(state);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;
