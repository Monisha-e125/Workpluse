import api from './api';

const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProjectAnalytics: (projectId) => api.get(`/analytics/project/${projectId}`),
  getActivityHeatmap: (userId) => api.get(`/analytics/heatmap/${userId || ''}`),
  getMoodAnalytics: (projectId) => api.get(`/analytics/mood/${projectId}`)
};

export default analyticsService;