import api from './api';

const userService = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  updateSkills: (skills) => api.put('/users/skills', { skills }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  deactivateUser: (id) => api.put(`/users/${id}/deactivate`),
  activateUser: (id) => api.put(`/users/${id}/activate`),
  getUserStats: () => api.get('/users/stats')
};

export default userService;