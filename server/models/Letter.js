const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    maxlength: 100,
    default: ''
  },
  body: {
    type: String,
    required: true,
    maxlength: 5000
  },
  tags: [{
    type: String
  }],
  form: {
    type: String,
    enum: ['lyric', 'narrative', 'experimental', 'haiku', 'sonnet', 'free-verse', 'prose-poem', 'spoken-word', 'other'],
    default: 'other'
  },
  themes: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  timesDelivered: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

letterSchema.methods.addLike = async function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    this.likeCount = this.likes.length;
    await this.save();
  }
};

module.exports = mongoose.model('Letter', letterSchema);
