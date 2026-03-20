import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    searchResults: [],
    selectedUser: null,
    pagination: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  }
});

export const { clearSearchResults, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;