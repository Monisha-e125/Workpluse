import api from './api';

const taskService = {
  getTasks: (params) => api.get('/tasks', { params }),
  getKanbanTasks: (projectId, params) => api.get(`/tasks/kanban/${projectId}`, { params }),
  getMyTasks: (params) => api.get('/tasks/my-tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, data) => api.patch(`/tasks/${id}/status`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  addComment: (id, data) => api.post(`/tasks/${id}/comments`, data)
};

export default taskService;