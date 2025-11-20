const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image_urls: [{
    type: String
  }],
  post_type: {
    type: String,
    enum: ['text', 'image', 'text_with_image', 'video'],
    default: 'text'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Extract hashtags from content before saving
postSchema.pre('save', function(next) {
  if (this.content) {
    const hashtags = this.content.match(/#\w+/g) || [];
    this.hashtags = hashtags.map(tag => tag.toLowerCase().substring(1));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);