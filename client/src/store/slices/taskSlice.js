import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchMyTasks = createAsyncThunk('tasks/fetchMy', async (params, { rejectWithValue }) => {
  try {
    const res = await taskService.getMyTasks(params);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { myTasks: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTasks.pending, (s) => { s.isLoading = true; })
      .addCase(fetchMyTasks.fulfilled, (s, a) => { s.isLoading = false; s.myTasks = a.payload; })
      .addCase(fetchMyTasks.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export default taskSlice.reducer;