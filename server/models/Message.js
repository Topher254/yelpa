const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  media_url: {
    type: String,
    default: ''
  },
  seen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient chat queries
messageSchema.index({ from_user_id: 1, to_user_id: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);