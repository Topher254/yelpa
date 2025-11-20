const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a story
router.post('/', storyController.createStory);

// Get stories for feed
router.get('/', storyController.getStories);

// Get user's stories
router.get('/user/:userId', storyController.getUserStories);

// Delete a story
router.delete('/:storyId', storyController.deleteStory);

module.exports = router;