import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';

export const fetchWorkload = createAsyncThunk('ai/workload', async (projectId, { rejectWithValue }) => {
  try { const res = await aiService.getWorkload(projectId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchTeamBurnout = createAsyncThunk('ai/teamBurnout', async (projectId, { rejectWithValue }) => {
  try { const res = await aiService.getTeamBurnout(projectId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchBurnout = createAsyncThunk('ai/burnout', async (userId, { rejectWithValue }) => {
  try { const res = await aiService.getBurnout(userId); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: { workload: null, teamBurnout: null, burnout: null, isLoading: false, error: null },
  reducers: { clearAI: (s) => { s.workload = null; s.teamBurnout = null; s.burnout = null; } },
  extraReducers: (b) => {
    b.addCase(fetchWorkload.pending, (s) => { s.isLoading = true; })
     .addCase(fetchWorkload.fulfilled, (s, a) => { s.isLoading = false; s.workload = a.payload; })
     .addCase(fetchWorkload.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
     .addCase(fetchTeamBurnout.pending, (s) => { s.isLoading = true; })
     .addCase(fetchTeamBurnout.fulfilled, (s, a) => { s.isLoading = false; s.teamBurnout = a.payload; })
     .addCase(fetchTeamBurnout.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
     .addCase(fetchBurnout.pending, (s) => { s.isLoading = true; })
     .addCase(fetchBurnout.fulfilled, (s, a) => { s.isLoading = false; s.burnout = a.payload; })
     .addCase(fetchBurnout.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export const { clearAI } = aiSlice.actions;
export default aiSlice.reducer;