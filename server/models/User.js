const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  interests: [{
    type: String,
    enum: ['lyric', 'narrative', 'experimental', 'haiku', 'sonnet', 'free-verse', 'prose-poem', 'spoken-word']
  }],
  themes: [{
    type: String,
    enum: ['love', 'grief', 'nature', 'city', 'identity', 'memory', 'politics', 'spirituality', 'humour']
  }],
  optedInToLetters: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'Europe/London'
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lettersSent: {
    type: Number,
    default: 0
  },
  likesReceived: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
