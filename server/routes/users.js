const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Development middleware
router.use((req, res, next) => {
  console.log('Users route hit:', req.method, req.url);
  next();
});

// Get user profile by database ID
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Fetching profile by database ID:', userId);

    let user;
    
    // Check if it's a valid ObjectId
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(userId);
    }
    
    // If not found by ID or not valid ObjectId, try by username
    if (!user) {
      user = await User.findOne({ 
        $or: [
          { username: userId },
          { clerkUserId: userId }
        ]
      });
    }

    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile by Clerk user ID
router.get('/profile-by-clerk/:clerkUserId', async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    console.log('Fetching profile by Clerk ID:', clerkUserId);

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      console.log('User not found for Clerk ID:', clerkUserId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recently registered users
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    
    let recentUsers = await User.find()
      .select('username full_name profile_picture bio location followers following is_verified createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);

    // If no users found, return sample data for development
    if (recentUsers.length === 0) {
      console.log('No users found, returning sample data');
      recentUsers = [
        {
          _id: 'user_1',
          username: 'john_doe',
          full_name: 'John Doe',
          profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Software developer and tech enthusiast',
          location: 'San Francisco, CA',
          followers: [],
          following: [],
          is_verified: false,
          createdAt: new Date()
        },
        {
          _id: 'user_2',
          username: 'jane_smith',
          full_name: 'Jane Smith',
          profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'Digital artist and designer',
          location: 'New York, NY',
          followers: [],
          following: [],
          is_verified: true,
          createdAt: new Date(Date.now() - 86400000)
        }
      ];
    }

    console.log(`Returning ${recentUsers.length} users`);
    res.json(recentUsers);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { full_name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    }).select('username full_name profile_picture bio location followers following is_verified');

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;