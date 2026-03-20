import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moodService from '../../services/moodService';

export const submitMood = createAsyncThunk('mood/submit', async (data, { rejectWithValue }) => {
  try { const res = await moodService.submitMood(data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMoodHistory = createAsyncThunk('mood/history', async (params, { rejectWithValue }) => {
  try { const res = await moodService.getMyHistory(params); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchTeamMood = createAsyncThunk('mood/team', async (projectId, { rejectWithValue }) => {
  try { const res = await moodService.getTeamMood(projectId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const moodSlice = createSlice({
  name: 'mood',
  initialState: { history: null, teamMood: null, isLoading: false, error: null },
  reducers: { clearMood: (s) => { s.history = null; s.teamMood = null; } },
  extraReducers: (b) => {
    b.addCase(fetchMoodHistory.pending, (s) => { s.isLoading = true; })
     .addCase(fetchMoodHistory.fulfilled, (s, a) => { s.isLoading = false; s.history = a.payload; })
     .addCase(fetchMoodHistory.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
     .addCase(fetchTeamMood.pending, (s) => { s.isLoading = true; })
     .addCase(fetchTeamMood.fulfilled, (s, a) => { s.isLoading = false; s.teamMood = a.payload; })
     .addCase(fetchTeamMood.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export const { clearMood } = moodSlice.actions;
export default moodSlice.reducer;