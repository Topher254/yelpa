const Story = require('../models/Story');
const User = require('../models/User');

// Create a story
exports.createStory = async (req, res) => {
  try {
    const { content, media_url, media_type, background_color } = req.body;
    const userId = req.user._id;

    console.log('Creating story for user:', userId);
    console.log('Story data:', { content, media_url, media_type, background_color });

    const story = new Story({
      user: userId,
      content: content || '',
      media_url: media_url || '',
      media_type: media_type || 'text',
      background_color: background_color || '#4f46e5'
    });

    await story.save();
    await story.populate('user', 'username full_name profile_picture is_verified');

    console.log('Story created successfully:', story._id);
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get stories for feed (user's stories + following users' stories)
exports.getStories = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Get stories from users that the current user is following and their own stories
    const stories = await Story.find({
      user: { $in: [userId, ...user.following] },
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username full_name profile_picture is_verified')
      .sort({ createdAt: -1 });

    // Group stories by user for the frontend
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: []
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's stories
exports.getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stories = await Story.find({ 
      user: userId,
      expiresAt: { $gt: new Date() }
    })
      .populate('user', 'username full_name profile_picture is_verified')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};