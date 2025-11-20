const User = require('../models/User');

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
    }

    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({ message: 'Already connected with this user' });
    }

    // Add to connections (for now, we'll implement direct connection)
    // In a real app, you might want a pending connections system
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { connections: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: currentUserId }
    });

    res.json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Send connection error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove connection
exports.removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { connections: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: currentUserId }
    });

    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user connections
exports.getConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('connections', 'username full_name profile_picture bio location followers following is_verified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.connections);
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get followers
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('followers', 'username full_name profile_picture bio location followers following is_verified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('following', 'username full_name profile_picture bio location followers following is_verified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};