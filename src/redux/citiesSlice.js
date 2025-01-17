import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { CITY_DATA } from '@/config/links/urls';

export const getAllCities = createAsyncThunk(
  'cities/getAllCities',
  async ({ page = 0, size = -1 } = {}) => {
    if (!page && !size) {
      page = 0;
      size = -1;
    }
    const response = await axios.get(CITY_DATA.all, { params: { page, size } });
    return response.data;
  },
);

export const createCity = createAsyncThunk(
  'cities/createCity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(CITY_DATA.create, data);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  cities: [],
  allCities: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
  pagination: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
};

export const citySlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
    },
    orderCities(state, { payload }) {
      const { column, direction } = payload;
      state.cities = state.cities.sort((a, b) => {
        if (typeof a[column] === 'number' && typeof b[column] === 'number') {
          return direction === 'DESC'
            ? b[column] - a[column]
            : a[column] - b[column];
        }
        if (column === 'createdAt') {
          const dateA = new Date(a[column]);
          const dateB = new Date(b[column]);
          return direction === 'DESC' ? dateB - dateA : dateA - dateB;
        }
        const stringA = String(a[column]).toLowerCase();
        const stringB = String(b[column]).toLowerCase();
        if (direction === 'DESC') {
          return stringB.localeCompare(stringA);
        } else {
          return stringA.localeCompare(stringB);
        }
      });
    },
    filterCity(state, { payload }) {
      state.cities = state.allCities.filter((city) => {
        return Object.entries(city).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCities.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllCities.fulfilled, (state, { payload }) => {
        const { content, currentPage, itemsPerPage, totalItems, totalPages } =
          payload;
        state.status = 'success';
        state.cities = content;
        state.allCities = content;
        state.pagination = {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages,
        };
      })
      .addCase(getAllCities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus, orderCities, filterCity } = citySlice.actions;
export default citySlice.reducer;
