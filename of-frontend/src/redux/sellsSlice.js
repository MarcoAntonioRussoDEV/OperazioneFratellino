import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { SELLS_DATA } from '@/config/links/urls';

export const getAllSells = createAsyncThunk('sells/getAllSells', async () => {
  const response = await axios.get(SELLS_DATA.all);
  return response.data;
});

export const createSell = createAsyncThunk(
  'sells/createSell',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(SELLS_DATA.create, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  sells: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
};

export const sellsSlice = createSlice({
  name: 'sells',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSells.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllSells.fulfilled, (state, action) => {
        state.status = 'success';
        state.sells = action.payload;
      })
      .addCase(getAllSells.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSell.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSell.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createSell.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = sellsSlice.actions;
export default sellsSlice.reducer;
