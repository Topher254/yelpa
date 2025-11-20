import api from './api';

export const messageService = {
  // Send a message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get messages between users
  getMessages: async (userId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get recent conversations
  getRecentConversations: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  // Mark messages as seen
  markAsSeen: async (userId) => {
    const response = await api.post(`/messages/${userId}/seen`);
    return response.data;
  },
};