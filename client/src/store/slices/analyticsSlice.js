import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

export const fetchDashboard = createAsyncThunk('analytics/dashboard', async (_, { rejectWithValue }) => {
  try { const res = await analyticsService.getDashboard(); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProjectAnalytics = createAsyncThunk('analytics/project', async (projectId, { rejectWithValue }) => {
  try { const res = await analyticsService.getProjectAnalytics(projectId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { dashboard: null, projectAnalytics: null, isLoading: false, error: null },
  reducers: { clearAnalytics: (s) => { s.projectAnalytics = null; } },
  extraReducers: (b) => {
    b.addCase(fetchDashboard.pending, (s) => { s.isLoading = true; })
     .addCase(fetchDashboard.fulfilled, (s, a) => { s.isLoading = false; s.dashboard = a.payload; })
     .addCase(fetchDashboard.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
     .addCase(fetchProjectAnalytics.pending, (s) => { s.isLoading = true; })
     .addCase(fetchProjectAnalytics.fulfilled, (s, a) => { s.isLoading = false; s.projectAnalytics = a.payload; })
     .addCase(fetchProjectAnalytics.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;