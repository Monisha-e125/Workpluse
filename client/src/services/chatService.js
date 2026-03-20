import api from './api';

const chatService = {
  getMessages: (projectId, params) => api.get(`/chat/${projectId}/messages`, { params }),
  sendMessage: (projectId, data) => api.post(`/chat/${projectId}/messages`, data),
  deleteMessage: (id) => api.delete(`/chat/messages/${id}`)
};

export default chatService;