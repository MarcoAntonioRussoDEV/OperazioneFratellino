import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { ADMIN_DATA } from '@/config/links/urls';
import { usernameInitials } from '@/utils/formatUtils';
import { blobToSrc, createInitialsImage } from '@/utils/imageUtils';

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async ({ page = 0, size = -1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(ADMIN_DATA.getAllUsers, {
        params: { page, size },
      });
      const { content, currentPage, itemsPerPage, totalItems, totalPages } =
        response.data;
      const users = content.map((user) => {
        let avatar = user.avatar;
        if (!user.avatar) {
          avatar = blobToSrc(createInitialsImage(usernameInitials(user.name)));
        } else {
          avatar = blobToSrc(user.avatar);
        }

        return { ...user, avatar };
      });

      return {
        content: users,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(ADMIN_DATA.deleteUser + data);
      return { email: data, response: response.data };
    } catch (error) {
      console.log('error: ', error);
      return rejectWithValue(error.response.data);
    }
  },
);

export const enableUser = createAsyncThunk(
  'users/enableUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(ADMIN_DATA.enableUser + data);
      return { email: data, response: response.data };
    } catch (error) {
      console.log('error: ', error);
      return rejectWithValue(error.response.data);
    }
  },
);

export const resetUserPassword = createAsyncThunk(
  'users/resetUserPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.patch(ADMIN_DATA.resetUserPassword + email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  users: [],
  allUsers: [],
  status: 'idle',
  filterDeleted: true,
  pagination: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
  toast: {
    status: null,
    error: null,
    response: null,
  },
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers(state) {
      state.users = [];
      state.status = 'idle';
      state.response = null;
    },
    resetStatus(state) {
      (state.status = 'idle'), (state.response = null), (state.error = null);
    },
    resetToastStatus(state) {
      state.toast.status = 'idle';
      state.toast.response = null;
    },
    setPage(state, { payload }) {
      state.pagination.currentPage = payload;
    },
    setItemsPerPage(state, { payload }) {
      state.pagination.itemsPerPage = payload;
    },
    filterUsers(state, { payload }) {
      if (state.filterDeleted) {
        state.users = state.allUsers.filter((user) => {
          if (!user.isDeleted) {
            return Object.entries(user).some(([_, value]) => {
              const stringValue = String(value).toLowerCase();
              return stringValue.includes(String(payload).toLowerCase());
            });
          }
        });
      } else {
        state.users = state.allUsers.filter((user) => {
          return Object.entries(user).some(([_, value]) => {
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(String(payload).toLowerCase());
          });
        });
      }
    },
    orderUsers(state, { payload }) {
      const { column, direction } = payload;
      state.users = state.users.sort((a, b) => {
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
    filterDeletedUsers(state) {
      state.users = state.users.filter((user) => !user.isDeleted);
      state.filterDeleted = true;
    },
    unfilterDeletedUsers(state) {
      state.users = state.allUsers;
      state.filterDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        const { content, currentPage, itemsPerPage, totalItems, totalPages } =
          payload;
        state.status = 'success';
        state.users = content.filter((user) => !user.isDeleted);
        state.allUsers = content;
        state.pagination.currentPage = currentPage;
        state.pagination.itemsPerPage = itemsPerPage;
        state.pagination.totalItems = totalItems;
        state.pagination.totalPages = totalPages;
      })
      .addCase(getAllUsers.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.toast.status = 'deleted';
        state.users = state.allUsers.filter(
          (user) => user.email != payload.email,
        );
        state.toast.response = payload.response;
        state.status = 'idle';
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.toast.status = 'failed';
        state.toast.error = payload;
        state.toast.response = payload || 'generic error';
      })
      .addCase(enableUser.fulfilled, (state, { payload }) => {
        state.toast.status = 'success';
        state.toast.users = state.allUsers.filter(
          (user) => user.email != payload.email,
        );
        state.toast.response = payload.response;
        state.status = 'idle';
      })
      .addCase(enableUser.rejected, (state, { payload }) => {
        state.toast.status = 'failed';
        state.toast.error = payload;
        state.toast.response = payload || 'generic error';
      })
      .addCase(resetUserPassword.fulfilled, (state, { payload }) => {
        state.toast.status = 'reset';
        state.toast.response = payload;
      })
      .addCase(resetUserPassword.rejected, (state, { payload }) => {
        state.toast.status = 'failed';
        state.toast.error = payload;
      });
  },
});

export const {
  resetUsers,
  resetStatus,
  resetToastStatus,
  filterUsers,
  orderUsers,
  filterDeletedUsers,
  unfilterDeletedUsers,
  setPage,
  setItemsPerPage,
} = usersSlice.actions;
export default usersSlice.reducer;
