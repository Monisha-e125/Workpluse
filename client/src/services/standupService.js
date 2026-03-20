import api from './api';

const standupService = {
  generate: (projectId) => api.post(`/standups/${projectId}/generate`),
  getStandups: (projectId, params) => api.get(`/standups/${projectId}`, { params }),
  getLatest: (projectId) => api.get(`/standups/${projectId}/latest`)
};

export default standupService;