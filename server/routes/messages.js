const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Development middleware
router.use((req, res, next) => {
  console.log('Messages route hit:', req.method, req.url);
  next();
});

// Get messages between two users
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching messages for user:', userId);
    
    // For development, get any messages involving this user
    const messages = await Message.find({
      $or: [
        { from_user_id: userId },
        { to_user_id: userId }
      ]
    })
      .populate('from_user_id', 'username full_name profile_picture')
      .populate('to_user_id', 'username full_name profile_picture')
      .sort({ createdAt: 1 }); // Oldest first

    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  try {
    const { from_user_id, to_user_id, text, message_type, media_url } = req.body;
    
    console.log('Sending message:', { from_user_id, to_user_id, text });
    
    const message = new Message({
      from_user_id,
      to_user_id,
      text: text || '',
      message_type: message_type || 'text',
      media_url: media_url || '',
      seen: false
    });

    await message.save();
    
    // Populate user data
    await message.populate('from_user_id', 'username full_name profile_picture');
    await message.populate('to_user_id', 'username full_name profile_picture');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get recent conversations
router.get('/', async (req, res) => {
  try {
    console.log('Fetching recent conversations');
    
    // For development, return some sample conversations
    const users = await User.find().limit(5);
    
    const conversations = users.map(user => ({
      _id: user._id,
      username: user.username,
      full_name: user.full_name,
      profile_picture: user.profile_picture,
      lastMessage: {
        text: 'Start a conversation...',
        createdAt: new Date()
      },
      unreadCount: 0
    }));

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching recent conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark messages as seen
router.post('/:userId/seen', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Message.updateMany(
      {
        to_user_id: userId,
        seen: false
      },
      { $set: { seen: true } }
    );

    res.json({ success: true, message: 'Messages marked as seen' });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;