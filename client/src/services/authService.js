import api from './api';

export const authService = {
  // Sync user with backend after Clerk authentication
  syncUser: async (userData) => {
    try {
      const response = await api.post('/auth/sync-user', userData);
      return response.data;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  },
};