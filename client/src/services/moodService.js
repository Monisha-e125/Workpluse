import api from './api';

const moodService = {
  submitMood: (data) => api.post('/mood/check-in', data),
  getMyHistory: (params) => api.get('/mood/history', { params }),
  getTeamMood: (projectId) => api.get(`/mood/team/${projectId}`)
};

export default moodService;