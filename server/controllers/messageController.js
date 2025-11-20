const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { to_user_id, text, media_url, message_type } = req.body;
    const from_user_id = req.user.id;

    const message = new Message({
      from_user_id,
      to_user_id,
      text,
      media_url,
      message_type
    });

    await message.save();
    await message.populate('from_user_id', 'username full_name profile_picture');
    await message.populate('to_user_id', 'username full_name profile_picture');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { from_user_id: currentUserId, to_user_id: userId },
        { from_user_id: userId, to_user_id: currentUserId }
      ]
    })
      .populate('from_user_id', 'username full_name profile_picture')
      .populate('to_user_id', 'username full_name profile_picture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark messages as seen
    await Message.updateMany(
      {
        from_user_id: userId,
        to_user_id: currentUserId,
        seen: false
      },
      { $set: { seen: true } }
    );

    // Reverse to show oldest first
    const reversedMessages = messages.reverse();

    res.json(reversedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent conversations
exports.getRecentConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get the last message from each conversation
    const recentMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from_user_id: currentUserId },
            { to_user_id: currentUserId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from_user_id', currentUserId] },
              '$to_user_id',
              '$from_user_id'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$to_user_id', currentUserId] },
                    { $eq: ['$seen', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          username: '$user.username',
          full_name: '$user.full_name',
          profile_picture: '$user.profile_picture',
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(recentMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark messages as seen
exports.markAsSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await Message.updateMany(
      {
        from_user_id: userId,
        to_user_id: currentUserId,
        seen: false
      },
      { $set: { seen: true } }
    );

    res.json({ message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};