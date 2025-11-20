import api from './api';

export const connectionService = {
  // Send connection request (follow user)
  sendConnectionRequest: async (userId) => {
    try {
      const response = await api.post(`/connections/request/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in sendConnectionRequest:', error);
      throw error;
    }
  },

  // Remove connection (unfollow user)
  removeConnection: async (userId) => {
    try {
      const response = await api.delete(`/connections/remove/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in removeConnection:', error);
      throw error;
    }
  },

  // Get user connections
  getConnections: async (userId) => {
    try {
      const response = await api.get(`/connections/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getConnections:', error);
      throw error;
    }
  },

  // Get followers
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/connections/followers/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getFollowers:', error);
      throw error;
    }
  },

  // Get following
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/connections/following/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getFollowing:', error);
      throw error;
    }
  },
};