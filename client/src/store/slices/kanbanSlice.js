import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchKanbanTasks = createAsyncThunk('kanban/fetch', async ({ projectId, params }, { rejectWithValue }) => {
  try {
    const res = await taskService.getKanbanTasks(projectId, params);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: { columns: {}, columnOrder: [], totalTasks: 0, isLoading: false, error: null },
  reducers: {
    updateColumns: (state, action) => { state.columns = action.payload; },
    clearKanban: (state) => { state.columns = {}; state.columnOrder = []; state.totalTasks = 0; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKanbanTasks.pending, (s) => { s.isLoading = true; })
      .addCase(fetchKanbanTasks.fulfilled, (s, a) => {
        s.isLoading = false;
        s.columns = a.payload.columns;
        s.columnOrder = a.payload.columnOrder;
        s.totalTasks = a.payload.totalTasks;
      })
      .addCase(fetchKanbanTasks.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export const { updateColumns, clearKanban } = kanbanSlice.actions;
export default kanbanSlice.reducer;