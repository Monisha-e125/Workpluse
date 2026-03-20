import api from './api';

const aiService = {
  autoAssign: (data) => api.post('/ai/auto-assign', data),
  getWorkload: (projectId) => api.get(`/ai/workload/${projectId}`),
  getBurnout: (userId) => api.get(`/ai/burnout/${userId}`),
  getTeamBurnout: (projectId) => api.get(`/ai/burnout/team/${projectId}`),
  getSkillMatch: (projectId, skills) => api.get(`/ai/skill-match/${projectId}?skills=${skills}`),
  getSprintPrediction: (projectId, sprintId) => api.get(`/ai/sprint-prediction/${projectId}/${sprintId}`)
};

export default aiService;