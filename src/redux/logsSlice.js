import { axios } from '@/config/axios/axiosConfig';
import { LOG_DATA } from '@/config/links/urls';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getAllLogs = createAsyncThunk(
  'logs/getAllLogs',
  async ({ page = 0, size = -1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(LOG_DATA.all, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  logs: [],
  loading: false,
  error: null,
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllLogs.fulfilled, (state, { payload }) => {
        const { content, itemsPerPage, totalItems, totalPages, currentPage } =
          payload;
        state.loading = false;
        state.logs = content.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
      })
      .addCase(getAllLogs.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// export const {  } = logsSlice.actions;

export default logsSlice.reducer;
