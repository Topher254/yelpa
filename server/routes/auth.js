const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sync user from Clerk to our database
router.post('/sync-user', async (req, res) => {
  try {
    const { clerkUserId, email, full_name, username, profile_picture } = req.body;

    console.log('Syncing user:', { clerkUserId, email, full_name, username });

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = new User({
        clerkUserId,
        email,
        full_name,
        username,
        profile_picture,
        cover_photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
        bio: 'Welcome to my profile!',
        location: 'Unknown',
        followers: [],
        following: [],
        connections: [],
        is_verified: false
      });
      await user.save();
      console.log('New user created:', user._id);
    } else {
      // Update existing user
      user = await User.findOneAndUpdate(
        { clerkUserId },
        { 
          email, 
          full_name, 
          username, 
          profile_picture 
        },
        { new: true }
      );
      console.log('User updated:', user._id);
    }

    res.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;