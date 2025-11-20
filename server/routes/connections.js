const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Send connection request (follow user)
router.post('/request/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Follow request for user:', userId);
    
    // For development, let's use a fixed current user
    // In production, this would come from auth middleware (req.user._id)
    const currentUserId = 'current_user_id'; // This should be the logged-in user's ID
    
    // Find both users
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);
    
    if (!currentUser || !targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already following this user' 
      });
    }
    
    // Add to following and followers
    currentUser.following.push(userId);
    targetUser.followers.push(currentUserId);
    
    await currentUser.save();
    await targetUser.save();
    
    console.log(`User ${currentUserId} now following ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Followed successfully!',
      following: true 
    });
  } catch (error) {
    console.error('Error sending follow request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Remove connection (unfollow user)
router.delete('/remove/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = 'current_user_id'; // This should be the logged-in user's ID
    
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);
    
    if (!currentUser || !targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Remove from following and followers
    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
    
    await currentUser.save();
    await targetUser.save();
    
    console.log(`User ${currentUserId} unfollowed ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Unfollowed successfully!',
      following: false 
    });
  } catch (error) {
    console.error('Error removing connection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});


// Get user connections
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('connections', 'username full_name profile_picture bio location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.connections || []);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('followers', 'username full_name profile_picture bio location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers || []);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get following
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('following', 'username full_name profile_picture bio location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following || []);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;