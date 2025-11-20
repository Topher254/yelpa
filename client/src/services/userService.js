import api from './api';

export const userService = {
  // Get user profile by database ID or username
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Get user profile by Clerk user ID
  getUserProfileByClerk: async (clerkUserId) => {
    const response = await api.get(`/users/profile-by-clerk/${clerkUserId}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get recently registered users
  getRecentUsers: async (limit = 12) => {
    const response = await api.get(`/users/recent?limit=${limit}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    const response = await api.put(`/users/profile/${userId}`, profileData);
    return response.data;
  },
};