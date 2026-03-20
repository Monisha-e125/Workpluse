import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await projectService.getProjects(params);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await projectService.getProjectById(id);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await projectService.createProject(data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    pagination: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentProject: (state) => { state.currentProject = null; },
    clearProjectError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.isLoading = true; })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.isLoading = false;
        s.projects = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(fetchProjectById.pending, (s) => { s.isLoading = true; })
      .addCase(fetchProjectById.fulfilled, (s, a) => { s.isLoading = false; s.currentProject = a.payload; })
      .addCase(fetchProjectById.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })
      .addCase(createProject.fulfilled, (s, a) => { s.projects.unshift(a.payload); });
  }
});

export const { clearCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;