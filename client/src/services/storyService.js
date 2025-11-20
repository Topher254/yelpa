import api from './api';

export const storyService = {
  // Create a story
  createStory: async (storyData) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  // Get stories for feed
  getStories: async () => {
    const response = await api.get('/stories');
    return response.data;
  },

  // Get user's stories
  getUserStories: async (userId) => {
    const response = await api.get(`/stories/user/${userId}`);
    return response.data;
  },

  // Delete a story
  deleteStory: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },
};